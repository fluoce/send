import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyCore } from './api-key.core';
import { CreateApiKeyDto, UpdateApiKeyDto } from './api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyCore: ApiKeyCore) {}

  async createApiKey(data: CreateApiKeyDto) {
    const apikey = await this.apiKeyCore.createApiKey(data);
    if (!apikey) {
      throw new ServiceUnavailableException('ApiKey creation failed');
    }
    return apikey;
  }

  async updateApiKey(data: UpdateApiKeyDto) {
    const apikey = await this.apiKeyCore.updateApiKey(data);
    if (!apikey) {
      throw new BadRequestException('ApiKey update failed');
    }
    return apikey;
  }

  async deleteApiKey(data: any) {
    const deletedApiKey = await this.apiKeyCore.deleteApiKey(data);
    if (!deletedApiKey) {
      throw new BadRequestException('ApiKey delete failed');
    }
    return deletedApiKey;
  }

  async getApiKey(data: any) {
    const apikey = await this.apiKeyCore.getApiKey(data);
    if (!apikey) {
      throw new BadRequestException('ApiKey not found');
    }
    return apikey;
  }

  async getApiKeys(data: { workspaceId: string }) {
    const apiKeys = await this.apiKeyCore.getApiKeys(data);
    if (!apiKeys) {
      throw new BadRequestException('Failed to get ApiKeys');
    }
    return apiKeys;
  }

  async getApiKeyByKey(data: { key: string }) {
    const apiKeys = await this.apiKeyCore.getApiKeyByKey(data);
    if (!apiKeys) {
      throw new BadRequestException('Failed to get ApiKey');
    }
    return apiKeys;
  }
}
