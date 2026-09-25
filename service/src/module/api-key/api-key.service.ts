import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyCore } from './api-key.core';
import {
  ApiKeyDto,
  AttachDomainWithApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from './api-key.dto';
import { ResponseDataType } from 'src/types/response.type';
import { DomainService } from '../domain/domain.service';
import { ApiKey, Domain } from 'src/config/database';
import { ApiKeyServiceInterface } from './api-key.interface';

@Injectable()
export class ApiKeyService implements ApiKeyServiceInterface {
  constructor(
    private readonly apiKeyCore: ApiKeyCore,
    private readonly domainService: DomainService,
  ) {}

  async createApiKey(data: CreateApiKeyDto): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  > {
    const apiKey = await this.apiKeyCore.createApiKey(data);
    if (!apiKey) {
      throw new ServiceUnavailableException('ApiKey creation failed');
    }
    return {
      message: 'Apikey created successfully',
      apiKey,
    };
  }

  async updateApiKey(data: UpdateApiKeyDto): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  > {
    const apiKey = await this.apiKeyCore.updateApiKey(data);
    if (!apiKey) {
      throw new BadRequestException('ApiKey update failed');
    }
    return {
      message: 'Apikey Updated successfully',
      apiKey,
    };
  }

  async deleteApiKey(data: any): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  > {
    const deletedApiKey = await this.apiKeyCore.deleteApiKey(data);
    if (!deletedApiKey) {
      throw new BadRequestException('ApiKey delete failed');
    }
    return {
      message: 'Apikey Deleted successfully',
      apiKey: deletedApiKey,
    };
  }

  async getApiKey({ apiKeyId, workspaceId }: ApiKeyDto): Promise<
    ResponseDataType<{
      apiKey: ApiKey & { domain: Domain | null };
    }>
  > {
    const apikey = await this.apiKeyCore.getApiKey({
      apiKeyId,
      workspaceId,
    });

    if (!apikey) {
      throw new BadRequestException('ApiKey not found');
    }

    let domain: Domain | null = null;

    if (apikey?.domainId) {
      const domainResponse = await this.domainService.getDomain({
        workspaceId,
        domainId: apikey.domainId,
      });
      domain = domainResponse?.domain ?? null;
    }

    return {
      message: 'Apikey fetched successfully',
      apiKey: {
        ...apikey,
        domain,
      },
    };
  }

  async getApiKeys({ workspaceId }: { workspaceId: string }): Promise<
    ResponseDataType<{
      apiKeys: (ApiKey & { domain: Domain | null })[];
    }>
  > {
    const [apikeys, domainsResponse] = await Promise.all([
      this.apiKeyCore.getApiKeys({
        workspaceId,
      }),
      this.domainService.getDomains({
        workspaceId,
      }),
    ]);

    const domains = domainsResponse.domains ?? [];

    const domainMap = new Map<string, Domain>(
      domains.map((domain: Domain) => [domain.id, domain]),
    );

    const apikeysWithDomain: (ApiKey & { domain: Domain | null })[] =
      apikeys.map((apikey) => {
        return {
          ...apikey,
          domain: apikey.domainId
            ? (domainMap.get(apikey.domainId) ?? null)
            : null,
        };
      });

    return {
      message: 'Apikeys fetched successfully',
      apiKeys: apikeysWithDomain,
    };
  }

  async getApiKeyByKey(data: { key: string }): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  > {
    const apiKey = await this.apiKeyCore.getApiKeyByKey(data);
    if (!apiKey) {
      throw new BadRequestException('Failed to get ApiKey');
    }
    return {
      message: 'Apikey fetched successfully',
      apiKey,
    };
  }

  async attachDomainWithApiKey({
    workspaceId,
    apiKeyId,
    domainId,
  }: AttachDomainWithApiKeyDto): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  > {
    if (domainId && domainId !== 'none') {
      const verifiedDomain =
        await this.domainService.getWorkspaceVerifiedDomainById({
          domainId,
          workspaceId,
        });

      if (!verifiedDomain.domain) {
        throw new BadRequestException(
          'Verified domain not found for this workspace',
        );
      }
    }

    const apiKey = await this.apiKeyCore.attachDomainWithApiKey({
      apiKeyId,
      domainId,
      workspaceId,
    });

    if (!apiKey) {
      throw new BadRequestException('Failed to attach domain');
    }

    return {
      message: 'Domain attached to ApiKey successfully',
      apiKey,
    };
  }
}
