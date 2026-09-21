import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { database, tableName } from 'src/config/database';
import {
  DeleteCommand,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
  QueryCommand,
  QueryCommandOutput,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { UlidService } from 'src/lib/ulid/ulid.service';
import { CreateDomainDto, DomainDto, UpdateDomainDto } from './domain.dto';
import { env } from 'src/config/env';
import { funcTryCatch } from 'src/function/func-try-catch';
import { funcBuildUpdateExpression } from 'src/function/func-build-update-expression';

@Injectable()
export class DomainCore {
  private readonly logger = new Logger(DomainCore.name);

  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
    private readonly ulid: UlidService,
  ) {}

  async createDomain({ domain, workspaceId }: CreateDomainDto) {
    if (!domain || !workspaceId) {
      throw new BadRequestException('Domain or workspaceId is required');
    }

    const normalizedDomain = this.normalizedDomain({
      domain,
    });

    const verifiedDomain = await this.checkVerifiedDomain({
      domain: normalizedDomain,
      workspaceId,
    });

    if (verifiedDomain) {
      throw new ConflictException('Domain is already verified');
    }

    const id = this.ulid.domainId();
    const now = new Date().toISOString();

    const item = {
      id,
      workspaceId,
      domain: normalizedDomain,
      status: 'PENDING',
      region: env().aws.region,
      dnsRecords: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await funcTryCatch<PutCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new PutCommand({
            TableName: tableName.domain,
            Item: item,
            ConditionExpression:
              'attribute_not_exists(workspaceId) AND attribute_not_exists(id)',
          }),
        ),
      logger: this.logger,
      action: 'createDomain_PutCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to add domain');
    }

    return item;
  }

  async deleteDomain({ domainId, workspaceId }: DomainDto) {
    const result = await funcTryCatch<DeleteCommandOutput | null, null>({
      func: () =>
        this.dynamoDB.send(
          new DeleteCommand({
            TableName: tableName.domain,
            Key: {
              workspaceId,
              id: domainId,
            },
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_OLD',
          }),
        ),
      logger: this.logger,
      action: 'deleteDomain_DeleteCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('Domain delete failed');
    }

    const { domain } = result.Attributes;
    if (domain?.status == 'VERIFIED') {
      await funcTryCatch<DeleteCommandOutput | null, null>({
        func: async () =>
          await this.dynamoDB.send(
            new DeleteCommand({
              TableName: tableName.verifiedDomain,
              Key: {
                domain: this.normalizedDomain({ domain }),
              },
              ConditionExpression: 'attribute_exists(domain)',
            }),
          ),
        logger: this.logger,
        action: 'deleteVerifiedDomain_DeleteCommand',
      });
    }

    return domain;
  }

  async updateDomain({ domainId, status, workspaceId }: UpdateDomainDto) {
    const domainResult = await funcTryCatch<GetCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.domain,
            Key: {
              workspaceId,
              id: domainId,
            },
          }),
        ),
      logger: this.logger,
      action: 'updateDomain_GetCommand',
    });

    if (!domainResult || !domainResult.Item) {
      throw new BadRequestException('Domain not found');
    }

    const currentStatus = domainResult.Item.status;

    if (!(
      (currentStatus === 'VERIFIED' && status === 'DISABLED') ||
      (currentStatus === 'DISABLED' && status === 'VERIFIED')
    )) {
      throw new BadRequestException(
        'Can only update status from VERIFIED to DISABLED, or from DISABLED to VERIFIED',
      );
    }

    const updateExpression = funcBuildUpdateExpression({
      status,
    });

    const result = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.domain,
            Key: {
              workspaceId,
              id: domainId,
            },
            ...updateExpression,
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        ),
      logger: this.logger,
      action: 'updateDomain_UpdateCommand',
    });

    if (!result?.Attributes) {
      throw new BadRequestException('Domain update failed');
    }

    return result.Attributes;
  }

  async getDomain({ domainId, workspaceId }: DomainDto) {
    const result = await funcTryCatch<GetCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.domain,
            Key: {
              workspaceId,
              id: domainId,
            },
          }),
        ),
      logger: this.logger,
      action: 'getDomain_GetCommand',
    });

    if (!result || !result.Item) {
      throw new BadRequestException('Domain not found');
    }

    return result.Item;
  }

  async getDomains({ workspaceId }: { workspaceId: string }) {
    const result = await funcTryCatch<QueryCommandOutput, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.domain,
            KeyConditionExpression: 'workspaceId = :workspaceId',
            ExpressionAttributeValues: { ':workspaceId': workspaceId },
          }),
        ),
      logger: this.logger,
      action: `getDomains_QueryCommand`,
    });

    if (!result) {
      throw new BadRequestException('Failed to get Domains');
    }

    return result?.Items ?? [];
  }

  async getVerifiedDomains({ workspaceId }: { workspaceId: string }) {
    const result = await funcTryCatch<QueryCommandOutput, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.domain,
            KeyConditionExpression: 'workspaceId = :workspaceId',
            FilterExpression: '#status = :status',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
              ':workspaceId': workspaceId,
              ':status': 'VERIFIED',
            },
          }),
        ),
      logger: this.logger,
      action: 'getVerifiedDomains_QueryCommand',
    });

    if (!result) {
      throw new BadRequestException('Failed to get Verified Domains');
    }

    return result?.Items ?? [];
  }

  async checkVerifiedDomain({
    domain,
    workspaceId,
  }: {
    domain: string;
    workspaceId: string;
  }) {
    const verifiedDomain = await this.getVerifiedDomain({
      domain,
    });

    if (!verifiedDomain) {
      return null;
    }

    if (verifiedDomain.workspaceId === workspaceId) {
      return verifiedDomain;
    }

    throw new ConflictException(
      'Domain is already verified by another workspace',
    );
  }

  async getVerifiedDomain({ domain }: { domain: string }) {
    const normalizedDomain = this.normalizedDomain({
      domain,
    });

    const result = await funcTryCatch<GetCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new GetCommand({
            TableName: tableName.verifiedDomain,
            Key: {
              domain: normalizedDomain,
            },
          }),
        ),
      logger: this.logger,
      action: 'getVerifiedDomain_GetCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException('Failed to check verified domain');
    }

    return result.Item ?? null;
  }

  normalizedDomain({ domain }: { domain: string }) {
    return domain.trim().toLowerCase();
  }
}
