import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyCore } from './api-key.core';
import {
  AttachDomainWithApiKeyDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from './api-key.dto';
import { ResponseDataType } from 'src/types/response.type';
import { DomainService } from '../domain/domain.service';

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

  async getApiKey(data: any): Promise<ResponseDataType> {
    const apikey = await this.apiKeyCore.getApiKey(data);
    if (!apikey) {
      throw new BadRequestException('ApiKey not found');
    }
    return {
      message: 'Apikey fetched successfully',
      apikey,
    };
  }

  async getApiKeys(data: { workspaceId: string }): Promise<ResponseDataType> {
    const apiKeys = await this.apiKeyCore.getApiKeys(data);
    if (!apiKeys) {
      throw new BadRequestException('Failed to get ApiKeys');
    }
    return {
      message: 'Apikeys fetched successfully',
      apiKeys,
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
