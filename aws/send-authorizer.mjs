import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const {
  SEND_FLUOCE_AWS_REGION: REGION,
  SEND_FLUOCE_AWS_ACCESS_KEY_ID: ACCESS_KEY_ID,
  SEND_FLUOCE_AWS_SECRET_ACCESS_KEY: SECRET_ACCESS_KEY,
  SEND_FLUOCE_AWS_DYNAMODB_API_KEY_TABLE_NAME: API_KEY_TABLE_NAME,
} = process.env;

const API_KEY_HEADER = "send-api-key";
const KEY_INDEX_NAME = "keyIndex";

if (!REGION || !API_KEY_TABLE_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error("Missing required environment variables");
}

const res = (statusCode, message, data = null) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ status: statusCode, message, data }),
});

function getHeader(headers, name) {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? headers[key]?.trim() || undefined : undefined;
}

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  }),
);

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

    return res(200, "Authorized", {
      isAuthorized: true,
      apiKeyId: apiKeyRecord.id,
      workspaceId: apiKeyRecord.workspaceId,
    });
  } catch (error) {
    console.error("authorizer handler failed", error);
    return res(500, "Internal server error", { isAuthorized: false });
  }
};
