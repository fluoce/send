import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  UpdateCommandOutput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  PutCommandOutput,
  GetCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { database, tableName } from 'src/config/database';
import { UlidService } from 'src/lib/ulid/ulid.service';
import { ApiKeyDto, CreateApiKeyDto, UpdateApiKeyDto } from './api-key.dto';
import { funcTryCatch } from 'src/function/func-try-catch';
import { funcGenerateApiKey } from 'src/function/func-generate-api-key';
import { funcBuildUpdateExpression } from 'src/function/func-build-update-expression';

@Injectable()
export class ApiKeyCore {
  private readonly logger = new Logger(ApiKeyCore.name);

  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
    private readonly ulid: UlidService,
  ) {}

  async createApiKey({ name, workspaceId, expireAt }: CreateApiKeyDto) {
    const id = this.ulid.apiKeyId();
    const key = funcGenerateApiKey();
    const now = new Date().toISOString();

    const item = {
      id,
      workspaceId,
      name,
      key,
      status: 'ACTIVE',
      createAt: now,
      updatedAt: now,
      expireAt,
    };

    const result = await funcTryCatch<PutCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new PutCommand({
            TableName: tableName.apiKey,
            Item: item,
            ConditionExpression:
              'attribute_not_exists(workspaceId) AND attribute_not_exists(id)',
          }),
        ),
      logger: this.logger,
      action: 'createApiKey_PutCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to create workspace');
    }

    return item;
  }

  async updateApiKey({
    apiKeyId,
    expireAt,
    name,
    status,
    workspaceId,
  }: UpdateApiKeyDto) {
    const updateExpression = funcBuildUpdateExpression({
      name,
      status,
      expireAt,
    });

    const result = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.apiKey,
            Key: {
              workspaceId,
              id: apiKeyId,
            },
            ...updateExpression,
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        ),
      logger: this.logger,
      action: 'updateApiKey_UpdateCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('ApiKey update failed');
    }

    return result.Attributes;
  }

  async deleteApiKey({ apiKeyId, workspaceId }: ApiKeyDto) {
    const result = await funcTryCatch<DeleteCommandOutput | null, null>({
      func: () =>
        this.dynamoDB.send(
          new DeleteCommand({
            TableName: tableName.apiKey,
            Key: {
              workspaceId,
              id: apiKeyId,
            },
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_OLD',
          }),
        ),
      logger: this.logger,
      action: 'deleteApiKey_DeleteCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('ApiKey delete failed');
    }

    return result.Attributes;
  }

  async getApiKey({ apiKeyId, workspaceId }: ApiKeyDto) {
    const result = await funcTryCatch<GetCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.apiKey,
            Key: {
              workspaceId,
              id: apiKeyId,
            },
          }),
        ),
      logger: this.logger,
      action: 'getApiKey_GetCommand',
    });

    if (!result || !result.Item) {
      throw new BadRequestException('ApiKey not found');
    }

    return result.Item;
  }

  async getApiKeys({ workspaceId }: { workspaceId: string }) {
    const result = await funcTryCatch<any, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.apiKey,
            KeyConditionExpression: 'workspaceId = :workspaceId',
            ExpressionAttributeValues: { ':workspaceId': workspaceId },
          }),
        ),
      logger: this.logger,
      action: `getApiKeys_QueryCommand`,
    });

    if (!result) {
      throw new BadRequestException('Failed to get ApiKeys');
    }

    return result?.Items ?? [];
  }

  async getApiKeyByKey({ key }: { key: string }) {
    const result = await funcTryCatch<any, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.apiKey,
            KeyConditionExpression: 'key = :key',
            ExpressionAttributeValues: { ':key': key },
          }),
        ),
      logger: this.logger,
      action: `getApiKeyByKey_QueryCommand`,
    });

    if (!result) {
      throw new BadRequestException('Failed to get ApiKey');
    }

    return result?.Items ?? [];
  }
}
