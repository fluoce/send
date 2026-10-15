import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { GetDashboardDto } from './dashboard.dto';
import {
  DashboardCoreInterface,
  DashboardResponse,
} from './dashboard.interface';
import { funcTryCatch } from 'src/function/func-try-catch';
import { database, Message, tableName } from 'src/config/database';

@Injectable()
export class DashboardCore implements DashboardCoreInterface {
  private readonly logger = new Logger(DashboardCore.name);

  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
  ) {}

  private async getEntityCount({
    tableName,
    workspaceId,
  }: {
    tableName: string;
    workspaceId: string;
  }): Promise<{
    total: number;
    statusCount: Record<string, number>;
  }> {
    let total = 0;
    let lastKey: Record<string, unknown> | undefined;
    const statusCount: Record<string, number> = {};

    do {
      const result = await funcTryCatch<any, null>({
        func: async () =>
          await this.dynamoDB.send(
            new QueryCommand({
              TableName: tableName,
              KeyConditionExpression: 'workspaceId = :workspaceId',
              ExpressionAttributeValues: {
                ':workspaceId': workspaceId,
              },
              ProjectionExpression: '#status',
              ExpressionAttributeNames: {
                '#status': 'status',
              },
              ExclusiveStartKey: lastKey,
            }),
          ),
        logger: this.logger,
        action: 'getEntityCount_QueryCommand',
      });

      if (!result) {
        throw new BadRequestException('Failed to count entity.');
      }

      for (const item of result.Items ?? []) {
        const status = item.status as string;
        total++;
        statusCount[status] = (statusCount[status] ?? 0) + 1;
      }

      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return { total, statusCount };
  }

  async getDashboard({
    workspaceId,
  }: GetDashboardDto): Promise<DashboardResponse> {
    const [
      messageCount,
      apiKeyCount,
      domainCount,
      templateCount,
      messagesResult,
    ] = await Promise.all([
      this.getEntityCount({
        tableName: tableName.message,
        workspaceId,
      }),
      this.getEntityCount({
        tableName: tableName.apiKey,
        workspaceId,
      }),
      this.getEntityCount({
        tableName: tableName.domain,
        workspaceId,
      }),
      this.getEntityCount({
        tableName: tableName.template,
        workspaceId,
      }),
      funcTryCatch<any, null>({
        func: async () =>
          await this.dynamoDB.send(
            new QueryCommand({
              TableName: tableName.message,
              KeyConditionExpression: 'workspaceId = :workspaceId',
              ExpressionAttributeValues: {
                ':workspaceId': workspaceId,
              },
              Limit: 10,
              ScanIndexForward: false,
            }),
          ),
        logger: this.logger,
        action: 'getDashboard_MessageQueryCommand',
      }),
    ]);

    if (!messagesResult) {
      throw new BadRequestException('Failed to get recent messages.');
    }

    const messages = (messagesResult.Items ?? []) as Message[];

    return {
      count: {
        messageCount: {
          title: 'Messages',
          ...messageCount,
        },
        apiKeyCount: {
          title: 'API Keys',
          ...apiKeyCount,
        },
        domainCount: {
          title: 'Domains',
          ...domainCount,
        },
        templateCount: {
          title: 'Templates',
          ...templateCount,
        },
      },
      messages,
    };
  }
}
