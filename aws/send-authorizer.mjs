import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.SEND_FLUOCE_AWS_REGION;
const ACCESS_KEY_ID = process.env.SEND_FLUOCE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SEND_FLUOCE_AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = process.env.SEND_FLUOCE_AWS_DYNAMODB_TABLE_NAME;
const API_KEY_HEADER = "send-api-key";
const KEY_INDEX_NAME = "keyIndex";

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const apiKey = event.headers?.[API_KEY_HEADER];
    if (!apiKey) {
      return { isAuthorized: false };
    }
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: KEY_INDEX_NAME,
      KeyConditionExpression: "#k = :k",
      ExpressionAttributeNames: { "#k": "key" },
      ExpressionAttributeValues: { ":k": apiKey },
      Limit: 1,
    });

    const result = await docClient.send(command);
    const apiKeyRecord = result.Items?.[0];
    if (!apiKeyRecord) {
      return { isAuthorized: false };
    }
    if (apiKeyRecord.status !== "ACTIVE") {
      return {
        isAuthorized: false,
        context: { apiKeyStatus: apiKeyRecord.status },
      };
    }
    return {
      isAuthorized: true,
      context: {
        apiKeyId: apiKeyRecord.id,
        workspaceId: apiKeyRecord.workspaceId,
      },
    };
  } catch (error) {
    return {
      isAuthorized: false,
      error,
    };
  }
};
