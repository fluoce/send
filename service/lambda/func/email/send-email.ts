import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { checkEnv } from '../../utils/check-env';
import { tryCatch } from '../../utils/try-catch';
import { getHeader } from '../../utils/get-header';
import { sendApiKeyHeaderName } from '../../utils/const';
import { ApiKey, Domain, Workspace } from 'src/config/database';
import { getId } from 'lambda/utils/id';
import { emailRegex } from 'src/config/regex';
import { parseFromAddress } from 'lambda/utils/parse-from-address';
import { parseBody } from 'lambda/utils/parse-body';
import { checkMaxLength } from 'lambda/utils/check-max-length';
import { res } from '../../utils/res';

const {
  REGION,
  API_KEY_TABLE_NAME,
  API_KEY_TABLE_INDEX_NAME,
  WORKSPACE_TABLE_NAME,
  VERIFIED_DOMAIN_TABLE_NAME,
  VERIFIED_DOMAIN_TABLE_INDEX_NAME,
  SEND_FROM,
  SQS_EMAIL_QUEUE_URL,
  MESSAGE_TABLE_NAME,
} = checkEnv({
  envs: [
    'REGION',
    'API_KEY_TABLE_NAME',
    'API_KEY_TABLE_INDEX_NAME',
    'WORKSPACE_TABLE_NAME',
    'VERIFIED_DOMAIN_TABLE_NAME',
    'VERIFIED_DOMAIN_TABLE_INDEX_NAME',
    'SEND_FROM',
    'SQS_EMAIL_QUEUE_URL',
    'MESSAGE_TABLE_NAME',
  ],
});

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION!,
  }),
);

const sqs = new SQSClient({
  region: REGION!,
});

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const key = getHeader({
    headers: event?.headers,
    name: sendApiKeyHeaderName,
  });
  if (!key) {
    return res({
      status: 401,
      message: 'API Key is missing',
    });
  }
  const body = parseBody({
    body: event?.body,
  });
  if (!body) {
    return res({
      status: 400,
      message: 'Request body is missing',
    });
  }
  return tryCatch({
    fn: async () => {
      const apiKeyRecord = await db.send(
        new QueryCommand({
          TableName: API_KEY_TABLE_NAME,
          IndexName: API_KEY_TABLE_INDEX_NAME,
          KeyConditionExpression: '#k = :k',
          ExpressionAttributeNames: { '#k': 'key' },
          ExpressionAttributeValues: { ':k': key },
          Limit: 1,
        }),
      );
      const apiKey = apiKeyRecord.Items?.[0] as ApiKey;
      if (!apiKey) {
        return res({
          status: 403,
          message: 'API key not found',
        });
      }
      if (apiKey?.status !== 'ACTIVE') {
        return res({
          status: 403,
          message: `API key is not Active ( status: ${apiKey?.status})`,
        });
      }

      const workspaceRecord = await db.send(
        new QueryCommand({
          TableName: WORKSPACE_TABLE_NAME,
          IndexName: 'idIndex',
          KeyConditionExpression: '#id = :id',
          ExpressionAttributeNames: {
            '#id': 'id',
          },
          ExpressionAttributeValues: {
            ':id': apiKey.workspaceId,
          },
          Limit: 1,
        }),
      );

      const workspace = workspaceRecord.Items?.[0] as Workspace | undefined;

      if (!workspace || workspace.status !== 'ACTIVE') {
        return res({
          status: 403,
          message: !workspace
            ? 'Workspace not found or inactive'
            : `Workspace is not Active ( status: ${workspace.status})`,
        });
      }

      const { from, to, subject, html } = body;
      let useFrom = SEND_FROM;
      if (from) {
        const parsedFrom = parseFromAddress({ from });
        if (!parsedFrom) {
          return res({
            status: 400,
            message:
              '\'from\' field must be a valid email address or formatted address (e.g., "Name <email@example.com>")',
            data: {
              from,
            },
          });
        }
        const domainRecord = await db.send(
          new QueryCommand({
            TableName: VERIFIED_DOMAIN_TABLE_NAME,
            IndexName: VERIFIED_DOMAIN_TABLE_INDEX_NAME,
            KeyConditionExpression: '#domain = :domain',
            FilterExpression: '#workspaceId = :workspaceId',
            ExpressionAttributeNames: {
              '#domain': 'domain',
              '#workspaceId': 'workspaceId',
            },
            ExpressionAttributeValues: {
              ':domain': parsedFrom.domain,
              ':workspaceId': workspace.id,
            },
          }),
        );
        if (!domainRecord?.Items || domainRecord.Items.length === 0) {
          return res({
            status: 403,
            message: `'from' domain is not allowed for this workspace`,
            data: {
              from,
              domain: parsedFrom.domain,
            },
          });
        }
        const domain = domainRecord.Items[0] as Domain;
        if (
          domain.workspaceId !== workspace.id ||
          domain.status !== 'VERIFIED'
        ) {
          return res({
            status: 403,
            message: 'Sender domain is not verified for this workspace',
          });
        }
        useFrom = parsedFrom.name
          ? `${parsedFrom.name} <${parsedFrom.email}>`
          : parsedFrom.email;
      }
      if (!Array.isArray(to) || to.length === 0) {
        return res({
          status: 400,
          message: "'to' field is required and must be a non-empty array",
        });
      }
      if (to.length > 10) {
        return res({
          status: 400,
          message: "'to' cannot exceed 10 recipients",
        });
      }
      if (
        !to.every(
          (email: unknown) =>
            typeof email === 'string' &&
            emailRegex.test(email.trim()) &&
            checkMaxLength({ field: email.trim(), maxLength: 254 }),
        )
      ) {
        return res({
          status: 400,
          message: "'to' must contain only valid email addresses",
          data: {
            to,
          },
        });
      }
      if (typeof subject !== 'string' || !subject.trim()) {
        return res({
          status: 400,
          message: "'subject' field is required and must be a non-empty string",
        });
      }
      if (!checkMaxLength({ field: subject.trim(), maxLength: 254 })) {
        return res({
          status: 400,
          message: "'subject' field must not exceed 254 characters",
        });
      }
      if (typeof html !== 'string' || !html.trim()) {
        return res({
          status: 400,
          message: "'html' field is required and must be a non-empty string",
        });
      }
      if (!checkMaxLength({ field: html.trim(), maxLength: 20000 })) {
        return res({
          status: 400,
          message: "'html' field must not exceed 20000 characters",
        });
      }
      const messageId = getId({ prefix: 'msg' });
      const emailJob = {
        v: '1',
        type: 'email',
        messageId,
        workspaceId: workspace.id,
        apiKeyId: apiKey.id,
        email: {
          from: useFrom,
          to: to.map((email) => email.trim()),
          subject: subject.trim(),
          html,
        },
        createdAt: new Date().toISOString(),
      };
      const sqsResult = await sqs.send(
        new SendMessageCommand({
          QueueUrl: SQS_EMAIL_QUEUE_URL,
          MessageBody: JSON.stringify(emailJob),
        }),
      );
      const serviceId = sqsResult?.MessageId || null;
      if (!serviceId) {
        return res({
          status: 500,
          message: 'Failed to queue email',
        });
      }
      const date = new Date().toISOString();
      const messageRecord = {
        id: messageId,
        workspaceId: workspace.id,
        apiKeyId: apiKey.id,
        serviceId,
        status: 'PENDING',
        type: 'EMAIL',
        from: useFrom,
        to: to.map((email) => email.trim()),
        subject,
        html,
        errorMessage: '',
        createdAt: date,
        updatedAt: date,
      };
      await db.send(
        new PutCommand({
          TableName: MESSAGE_TABLE_NAME,
          Item: messageRecord,
        }),
      );
      return res({
        status: 202,
        message: 'Email in queue',
        data: {
          messageId,
        },
      });
    },
  });
};
