import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyCore } from './api-key.core';
import { CreateApiKeyDto, UpdateApiKeyDto } from './api-key.dto';
import { ResponseDataType } from 'src/types/response.type';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyCore: ApiKeyCore) {}

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
