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
import { Domain } from 'src/config/database';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyCore: ApiKeyCore,
    private readonly domainService: DomainService,
  ) {}

  async createApiKey(data: CreateApiKeyDto): Promise<ResponseDataType> {
    const apikey = await this.apiKeyCore.createApiKey(data);
    if (!apikey) {
      throw new ServiceUnavailableException('ApiKey creation failed');
    }
    return {
      message: 'Apikey created successfully',
      apikey,
    };
  }

  async updateApiKey(data: UpdateApiKeyDto): Promise<ResponseDataType> {
    const apikey = await this.apiKeyCore.updateApiKey(data);
    if (!apikey) {
      throw new BadRequestException('ApiKey update failed');
    }
    return {
      message: 'Apikey Updated successfully',
      apikey,
    };
  }

  async attachDomain({
    workspaceId,
    apiKeyId,
    domainId,
  }: AttachDomainWithApiKeyDto): Promise<ResponseDataType> {
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

    const apikey = await this.apiKeyCore.attachDomain({
      apiKeyId,
      domainId,
      workspaceId,
    });

    if (!apikey) {
      throw new BadRequestException('Failed to attach domain');
    }

    return {
      message: 'Domain attached to ApiKey successfully',
      apikey,
    };
  }

  async deleteApiKey(data: any): Promise<ResponseDataType> {
    const deletedApiKey = await this.apiKeyCore.deleteApiKey(data);
    if (!deletedApiKey) {
      throw new BadRequestException('ApiKey delete failed');
    }
    return {
      message: 'Apikey Deleted successfully',
      apiKey: deletedApiKey,
    };
  }

  async getApiKey({
    apiKeyId,
    workspaceId,
  }: ApiKeyDto): Promise<ResponseDataType> {
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
      apikey: {
        ...apikey,
        domain,
      },
    };
  }

  async getApiKeys({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<ResponseDataType> {
    const [apikeys, domainsResponse] = await Promise.all([
      this.apiKeyCore.getApiKeys({
        workspaceId,
      }),

      this.domainService.getDomains({
        workspaceId,
      }),
    ]);

    const domains = domainsResponse.domains ?? [];

    const domainMap = new Map(
      domains.map((domain: Domain) => [domain.id, domain]),
    );

    const apikeysWithDomain = apikeys.map((apikey) => ({
      ...apikey,
      domain: apikey.domainId ? (domainMap.get(apikey.domainId) ?? null) : null,
    }));

    return {
      message: 'Apikeys fetched successfully',
      apiKeys: apikeysWithDomain,
    };
  }

  async getApiKeyByKey(data: { key: string }): Promise<ResponseDataType> {
    const apiKey = await this.apiKeyCore.getApiKeyByKey(data);
    if (!apiKey) {
      throw new BadRequestException('Failed to get ApiKey');
    }
    return {
      message: 'Apikey fetched successfully',
      apiKey,
    };
  }
}
