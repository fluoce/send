import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommandOutput,
  UpdateCommandOutput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { database, tableName, Workspace } from 'src/config/database';
import { UlidService } from 'src/lib/ulid/ulid.service';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  UpdateWorkspaceDto,
} from './workspace.dto';
import { funcTryCatch } from 'src/function/func-try-catch';
import { funcBuildUpdateExpression } from 'src/function/func-build-update-expression';

@Injectable()
export class WorkspaceCore {
  private readonly logger = new Logger(WorkspaceCore.name);

  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
    private readonly ulid: UlidService,
  ) {}

  async createWorkspace({ name, userId }: CreateWorkspaceDto) {
    const date = new Date().toISOString();
    const id = this.ulid.workspaceId();
    const item = {
      id,
      userId,
      name,
      status: 'ACTIVE',
      createdAt: date,
      updatedAt: date,
    };

    const result = await funcTryCatch({
      func: async () =>
        await this.dynamoDB.send(
          new PutCommand({
            TableName: tableName.workspace,
            Item: item,
            ConditionExpression:
              'attribute_not_exists(userId) AND attribute_not_exists(id)',
          }),
        ),
      logger: this.logger,
      action: 'createWorkspace_PutCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to create workspace');
    }

    return item;
  }

  async updateWorkspace({
    name,
    status,
    workspaceId,
    userId,
  }: UpdateWorkspaceDto) {
    const updateExpression = funcBuildUpdateExpression({
      name,
      status,
    });

    const result = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.workspace,
            Key: {
              userId,
              id: workspaceId,
            },
            ...updateExpression,
            ConditionExpression:
              'attribute_exists(userId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        ),
      logger: this.logger,
      action: 'updateWorkspace_UpdateCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('Workspace update failed');
    }

    return result.Attributes;
  }

  async getWorkspace({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }) {
    const result = await funcTryCatch<GetCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.workspace,
            Key: {
              userId,
              id: workspaceId,
            },
          }),
        ),

      logger: this.logger,
      action: 'getWorkspace_GetCommand',
    });

    if (!result?.Item) {
      return null;
    }

    return result.Item;
  }

  async getWorkspaces({ userId }: { userId: string }) {
    return await this.queryWorkspacesByStatus({
      status: 'ACTIVE',
      userId,
    });
  }

  async getTrashWorkspaces({ userId }: { userId: string }) {
    return await this.queryWorkspacesByStatus({
      status: 'DEACTIVE',
      userId,
    });
  }

  async deleteWorkspace({ userId, workspaceId }: DeleteWorkspaceDto) {
    const result = await funcTryCatch<DeleteCommandOutput | null, null>({
      func: () =>
        this.dynamoDB.send(
          new DeleteCommand({
            TableName: tableName.workspace,
            Key: {
              userId,
              id: workspaceId,
            },
            ConditionExpression:
              'attribute_exists(userId) AND attribute_exists(id)',

            ReturnValues: 'ALL_OLD',
          }),
        ),
      logger: this.logger,
      action: 'deleteWorkspace_DeleteCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('Workspace delete failed');
    }

    return result.Attributes;
  }

  private async queryWorkspacesByStatus({
    userId,
    status,
  }: Pick<Workspace, 'userId' | 'status'>) {
    const result = await funcTryCatch<any, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.workspace,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: '#status = :status',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':userId': userId, ':status': status },
          }),
        ),
      logger: this.logger,
      action: `getWorkspacesByStatus_${status}_QueryCommand`,
    });

    if (!result) {
      throw new BadRequestException('Failed to query workspaces by status');
    }

    return result?.Items ?? [];
  }
}
