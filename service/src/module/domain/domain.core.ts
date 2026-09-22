import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { database, DnsRecord, Domain, tableName } from 'src/config/database';
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
import { SES_CLIENT } from 'src/config/ses';
import {
  CreateEmailIdentityCommand,
  GetEmailIdentityCommand,
  GetEmailIdentityCommandOutput,
  SESv2Client,
} from '@aws-sdk/client-sesv2';

@Injectable()
export class DomainCore {
  private readonly logger = new Logger(DomainCore.name);

  constructor(
    @Inject(database.dynamoDB)
    private readonly dynamoDB: DynamoDBDocumentClient,
    private readonly ulid: UlidService,
    @Inject(SES_CLIENT)
    private readonly ses: SESv2Client,
  ) {}

  async createDomain({ domain, workspaceId }: CreateDomainDto) {
    const normalizedDomain = this.normalizedDomain({ domain });

    const verifiedDomain = await this.checkVerifiedDomain({
      domain: normalizedDomain,
      workspaceId,
    });

    if (verifiedDomain) {
      throw new ConflictException('Domain is already verified');
    }

    const sesResult = await this.createSesIdentity({
      domain: normalizedDomain,
    });

    const tokens = sesResult.DkimAttributes?.Tokens;

    const signingHostedZone = sesResult.DkimAttributes?.SigningHostedZone;

    if (!tokens?.length || !signingHostedZone) {
      throw new ServiceUnavailableException(
        'Failed to get DKIM DNS records from SES',
      );
    }

    const dnsRecords: DnsRecord[] = this.buildDnsRecords({
      domain: normalizedDomain,
      tokens,
      signingHostedZone,
    });

    const id = this.ulid.domainId();
    const now = new Date().toISOString();

    const item = {
      id,
      workspaceId,
      domain: normalizedDomain,
      status: 'PENDING',
      region: env().aws.region,
      dnsRecords,
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

  async getWorkspaceVerifiedDomainById({
    domainId,
    workspaceId,
  }: {
    domainId: string;
    workspaceId: string;
  }): Promise<Domain | null> {
    const result = await funcTryCatch<QueryCommandOutput | null, null>({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.verifiedDomain,
            IndexName: 'DomainIdIndex',
            KeyConditionExpression: 'domainId = :domainId',
            FilterExpression: 'workspaceId = :workspaceId',
            ExpressionAttributeValues: {
              ':domainId': domainId,
              ':workspaceId': workspaceId,
            },
            Limit: 1,
          }),
        ),
      logger: this.logger,
      action: 'getVerifiedDomain_QueryCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException(
        'Failed to check verified domain for workspace!',
      );
    }

    return result.Items?.[0] ? (result.Items[0] as Domain) : null;
  }

  async createSesIdentity({ domain }: { domain: string }) {
    const result = await funcTryCatch<
      GetEmailIdentityCommandOutput | null,
      null
    >({
      func: async () =>
        await this.ses.send(
          new CreateEmailIdentityCommand({
            EmailIdentity: domain,
            DkimSigningAttributes: {
              NextSigningKeyLength: 'RSA_2048_BIT',
            },
          }),
        ),
      logger: this.logger,
      action: 'createSesIdentity_CreateEmailIdentityCommand',
    });

    if (!result) {
      throw new ServiceUnavailableException(
        'Failed to create SES email identity',
      );
    }

    return result;
  }

  async verifyDomain({
    domainId,
    workspaceId,
  }: DomainDto): Promise<
    Domain & { verified?: boolean; verificationStatus?: string }
  > {
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
      action: 'verifyDomain_GetDomain_GetCommand',
    });

    if (!domainResult) {
      throw new ServiceUnavailableException('Failed to get domain');
    }

    if (!domainResult.Item) {
      throw new BadRequestException('Domain not found');
    }

    const domain = domainResult.Item as Domain;

    if (domain.status === 'VERIFIED') {
      return {
        ...domain,
        verified: true,
      };
    }

    const sesResult = await funcTryCatch<
      GetEmailIdentityCommandOutput | null,
      null
    >({
      func: async () =>
        await this.ses.send(
          new GetEmailIdentityCommand({
            EmailIdentity: domain.domain,
          }),
        ),
      logger: this.logger,
      action: 'verifyDomain_GetEmailIdentity',
    });

    if (!sesResult) {
      throw new ServiceUnavailableException(
        'Failed to check domain verification with SES',
      );
    }

    const dkimStatus = sesResult.DkimAttributes?.Status;

    if (dkimStatus !== 'SUCCESS') {
      return {
        ...domain,
        status: 'PENDING',
        verified: false,
      };
    }

    const verifiedAt = new Date().toISOString();

    const existingVerifiedDomain = await funcTryCatch<
      QueryCommandOutput | null,
      null
    >({
      func: async () =>
        await this.dynamoDB.send(
          new QueryCommand({
            TableName: tableName.verifiedDomain,
            IndexName: 'DomainIdIndex',
            KeyConditionExpression: 'domainId = :domainId',
            FilterExpression: 'workspaceId = :workspaceId',
            ExpressionAttributeValues: {
              ':domainId': domain.id,
              ':workspaceId': workspaceId,
            },
            Limit: 1,
          }),
        ),
      logger: this.logger,
      action: 'verifyDomain_CheckExistingVerifiedDomain_QueryCommand',
    });

    if (
      !existingVerifiedDomain ||
      !existingVerifiedDomain.Items ||
      !existingVerifiedDomain.Items[0]
    ) {
      const verifiedDomain = {
        domain: domain.domain,
        workspaceId,
        domainId: domain.id,
        verifiedAt,
      };

      const verifiedResult = await funcTryCatch<PutCommandOutput | null, null>({
        func: async () =>
          await this.dynamoDB.send(
            new PutCommand({
              TableName: tableName.verifiedDomain,
              Item: verifiedDomain,
              ConditionExpression: 'attribute_not_exists(#domainAttr)',
              ExpressionAttributeNames: {
                '#domainAttr': 'domain',
              },
            }),
          ),
        logger: this.logger,
        action: 'verifyDomain_CreateVerifiedDomain_PutCommand',
      });

      if (!verifiedResult) {
        throw new ServiceUnavailableException(
          'Failed to create verified domain record',
        );
      }
    }

    const updateResult = await funcTryCatch<UpdateCommandOutput | null, null>({
      func: async () => {
        const {
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
        } = funcBuildUpdateExpression({
          status: 'VERIFIED',
        });

        return await this.dynamoDB.send(
          new UpdateCommand({
            TableName: tableName.domain,
            Key: {
              workspaceId,
              id: domainId,
            },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            ConditionExpression:
              'attribute_exists(workspaceId) AND attribute_exists(id)',
            ReturnValues: 'ALL_NEW',
          }),
        );
      },
      logger: this.logger,
      action: 'verifyDomain_UpdateDomain_UpdateCommand',
    });

    if (!updateResult?.Attributes) {
      throw new ServiceUnavailableException(
        'Domain verified but failed to update domain status',
      );
    }

    return {
      ...(updateResult.Attributes as Domain),
      verified: true,
    };
  }

  private normalizedDomain({ domain }: { domain: string }) {
    return domain.trim().toLowerCase();
  }

  private buildDnsRecords({
    domain,
    tokens,
    signingHostedZone,
  }: {
    domain: string;
    tokens: string[];
    signingHostedZone: string;
  }): DnsRecord[] {
    return tokens.map((token) => ({
      type: 'CNAME',
      name: `${token}._domainkey.${domain}`,
      value: `${token}.${signingHostedZone}`,
    }));
  }
}
