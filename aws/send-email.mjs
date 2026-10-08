import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { randomUUID } from "node:crypto";

const {
  SEND_FLUOCE_AWS_REGION: REGION,
  SEND_FLUOCE_AWS_DYNAMODB_API_KEY_TABLE_NAME: API_KEY_TABLE_NAME,
  SEND_FLUOCE_AWS_DYNAMODB_VERIFIED_DOMAIN_TABLE_NAME:
    VERIFIED_DOMAIN_TABLE_NAME,
  SEND_FLUOCE_AWS_ACCESS_KEY_ID: ACCESS_KEY_ID,
  SEND_FLUOCE_AWS_SECRET_ACCESS_KEY: SECRET_ACCESS_KEY,
  SEND_FLUOCE_EMAIL_QUEUE_URL: EMAIL_QUEUE_URL,
  SEND_FLUOCE_AWS_ACCESS_KEY_ID_SQS: ACCESS_KEY_ID_SQS,
  SEND_FLUOCE_AWS_SECRET_ACCESS_KEY_SQS: SECRET_ACCESS_KEY_SQS,
} = process.env;

if (
  !REGION ||
  !API_KEY_TABLE_NAME ||
  !EMAIL_QUEUE_URL ||
  !VERIFIED_DOMAIN_TABLE_NAME ||
  !ACCESS_KEY_ID ||
  !SECRET_ACCESS_KEY ||
  !ACCESS_KEY_ID_SQS ||
  !SECRET_ACCESS_KEY_SQS
) {
  throw new Error("Missing required environment variables");
}

const API_KEY_HEADER = "send-api-key";
const KEY_INDEX_NAME = "keyIndex";
const SEND_FROM = "FLUOCE <send@fluoce.com>";
const MAX_RECIPIENTS = 12;
const MAX_HTML_BYTES = 200_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  }),
);

const sqsClient = new SQSClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID_SQS,
    secretAccessKey: SECRET_ACCESS_KEY_SQS,
  },
});

const res = (statusCode, message, data = null) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ status: statusCode, message, data }),
});

export const handler = async (event) => {
  try {
    const apiKey = getHeader(event.headers, API_KEY_HEADER);
    if (!apiKey) return res(401, "API key is missing", { isAuthorized: false });
    const result = await docClient.send(
      new QueryCommand({
        TableName: API_KEY_TABLE_NAME,
        IndexName: KEY_INDEX_NAME,
        KeyConditionExpression: "#k = :k",
        ExpressionAttributeNames: { "#k": "key" },
        ExpressionAttributeValues: { ":k": apiKey },
        Limit: 1,
      }),
    );
    const apiKeyRecord = result.Items?.[0];
    if (!apiKeyRecord)
      return res(403, "API key not found", { isAuthorized: false });
    if (apiKeyRecord.status !== "ACTIVE")
      return res(
        403,
        `API key is not active (status: ${apiKeyRecord.status})`,
        { isAuthorized: false },
      );
    const body = parseBody(event);
    if (body === undefined) return res(400, "Body is not valid JSON");
    if (body === null || typeof body !== "object" || Array.isArray(body))
      return res(400, "'body' is required and must be an object", {
        missingValue: ["body"],
      });
    const { from, to, subject, html } = body;
    if (!Array.isArray(to) || to.length === 0)
      return res(400, "'to' is required and must be a non-empty array", {
        missingValue: ["to"],
      });
    if (to.length > MAX_RECIPIENTS)
      return res(
        400,
        `'to' cannot have more than ${MAX_RECIPIENTS} recipients`,
        {
          invalidValue: ["to"],
          details: { allowedLength: MAX_RECIPIENTS },
        },
      );
    const invalidTo = to.filter(
      (e) => typeof e !== "string" || e.length > 254 || !EMAIL_REGEX.test(e),
    );
    if (invalidTo.length > 0)
      return res(400, "'to' contains invalid email addresses", {
        invalidValue: ["to"],
        details: { invalidTo },
      });
    const recipients = Array.from(
      new Set(to.map((email) => email.trim().toLowerCase())),
    );
    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      subject.length > 998 ||
      /[\r\n]/.test(subject)
    )
      return res(
        400,
        "'subject' is required, must be a single-line string (max 998 chars)",
        { invalidValue: ["subject"] },
      );

    if (typeof html !== "string" || !html.trim())
      return res(400, "'html' is required and must be a string", {
        missingValue: ["html"],
      });
    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES)
      return res(413, `'html' exceeds ${MAX_HTML_BYTES} bytes`, {
        invalidValue: ["html"],
      });
    let useFrom = from || SEND_FROM;
    // if (from !== undefined) {
    //   if (typeof from !== "string")
    //     return res(400, "'from' must be a string", { invalidValue: ["from"] });
    //   const fromInfo = parseFromAddress(from);
    //   if (!fromInfo)
    //     return res(400, "'from' address is invalid", {
    //       invalidValue: ["from"],
    //       details: { from },
    //     });
    //   const verifiedDomainResult = await docClient.send(
    //     new GetCommand({
    //       TableName: VERIFIED_DOMAIN_TABLE_NAME,
    //       Key: {
    //         domain: fromInfo.domain,
    //       },
    //     }),
    //   );
    //   const verifiedDomain = verifiedDomainResult.Item;
    //   if (!verifiedDomain) {
    //     return res(
    //       403,
    //       "The 'from' domain is not verified or not attached to this workspace",
    //       {
    //         domain: fromInfo.domain,
    //       },
    //     );
    //   }
    //   if (verifiedDomain.workspaceId !== apiKeyRecord.workspaceId) {
    //     return res(403, "The 'from' domain is not attached to this workspace", {
    //       domain: fromInfo.domain,
    //     });
    //   }
    //   if (apiKeyRecord.domainId !== verifiedDomain.domainId) {
    //     return res(403, "The 'from' domain is not attached to this API key", {
    //       domain: fromInfo.domain,
    //     });
    //   }
    //   useFrom = fromInfo.name
    //     ? `"${fromInfo.name}" <${fromInfo.email}>`
    //     : fromInfo.email;
    // }
    const messageId = `msg_${randomUUID()}`;
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: EMAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          v: "1",
          type: "email",
          messageId,
          workspaceId: apiKeyRecord.workspaceId,
          apiKeyId: apiKeyRecord.id,
          email: { from: useFrom, to: recipients, subject, html },
          createdAt: new Date().toISOString(),
        }),
      }),
    );
    return {
      statusCode: 202,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: messageId, status: "QUEUED" }),
    };
  } catch (error) {
    console.error("send handler failed", error);
    return res(500, "Internal server error");
  }
};

function getHeader(headers, name) {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? headers[key]?.trim() || undefined : undefined;
}

function parseBody(event) {
  let raw = event?.body;
  if (raw == null) return null;
  if (typeof raw !== "string") return raw;
  if (event.isBase64Encoded) raw = Buffer.from(raw, "base64").toString("utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function parseFromAddress(from) {
  if (/[\r\n]/.test(from)) return null;
  const match = from.match(/^(.*)<\s*([^<>]+)\s*>$/);
  let name = null;
  let email;
  if (match) {
    name =
      match[1]
        .trim()
        .replace(/^"(.+)"$/, "$1")
        .replace(/["\\]/g, "")
        .trim() || null;
    email = match[2].trim();
  } else {
    email = from.trim();
  }
  if (email.length > 254 || !EMAIL_REGEX.test(email)) return null;
  return { name, email, domain: email.split("@")[1].toLowerCase() };
}
