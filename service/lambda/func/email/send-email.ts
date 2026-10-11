import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { checkEnv } from '../../utils/check-env';
import { res } from '../../utils/res';
import { tryCatch } from '../../utils/try-catch';
import { getHeader } from '../../utils/get-header';
import { sendApiKeyHeaderName } from '../../utils/const';
import { ApiKey } from 'src/config/database';
import { getId } from 'lambda/utils/id';

const {
  REGION,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  API_KEY_TABLE_NAME,
  API_KEY_TABLE_INDEX_NAME,
} = checkEnv({
  envs: [
    'REGION',
    'ACCESS_KEY_ID',
    'SECRET_ACCESS_KEY',
    'API_KEY_TABLE_NAME',
    'API_KEY_TABLE_INDEX_NAME',
  ],
});

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION!,
    credentials: {
      accessKeyId: ACCESS_KEY_ID!,
      secretAccessKey: SECRET_ACCESS_KEY!,
    },
  }),
);

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const key = getHeader({
    headers: event?.headers,
    name: sendApiKeyHeaderName,
  });
  const body =
    typeof event?.body === 'object'
      ? event.body
      : JSON.parse(event.body ?? '{}');
  if (!key) {
    return res({
      status: 401,
      message: 'API Key is missing',
    });
  }
  return tryCatch({
    fn: async () => {
      const r = await db.send(
        new QueryCommand({
          TableName: API_KEY_TABLE_NAME,
          IndexName: API_KEY_TABLE_INDEX_NAME,
          KeyConditionExpression: '#k = :k',
          ExpressionAttributeNames: { '#k': 'key' },
          ExpressionAttributeValues: { ':k': key },
          Limit: 1,
        }),
      );
      if (!r) {
        return res({
          status: 503,
          message: 'Database service unavailable',
        });
      }
      const apiKey = r.Items?.[0] as ApiKey;
      if (!apiKey) {
        return res({
          status: 403,
          message: 'API key not found',
        });
      }
      if (apiKey?.status !== 'ACTIVE') {
        return res({
          status: 403,
          message: `API key is not Active ( status: ${apiKey?.status})  `,
        });
      }
      return res({
        status: 202,
        data: {
          messageId: getId({
            prefix: 'msg',
          }),
          ...body,
          message: 'Email accepted for processing !',
        },
      });
    },
  });
};
