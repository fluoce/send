import { ApiKey, Domain, Workspace } from 'src/config/database';
import {
  AttachDomainWithApiKeyBodyDto,
  AttachDomainWithApiKeyDto,
  CreateApiKeyBodyDto,
  CreateApiKeyDto,
  DeleteApiKeyDto,
  GetApiKeyByKeyDto,
  GetApiKeyDto,
  GetApiKeysDto,
  UpdateApiKeyBodyDto,
  UpdateApiKeyDto,
} from './api-key.dto';
import { ResponseDataType } from 'src/types/response.type';

export interface ApiKeyCoreInterface {
  createApiKey: (p: CreateApiKeyDto) => Promise<ApiKey>;
  updateApiKey: (p: UpdateApiKeyDto) => Promise<ApiKey>;
  deleteApiKey: (p: DeleteApiKeyDto) => Promise<ApiKey>;
  getApiKey: (p: GetApiKeyDto) => Promise<ApiKey>;
  getApiKeys: (p: GetApiKeysDto) => Promise<ApiKey[]>;
  getApiKeyByKey: (p: GetApiKeyByKeyDto) => Promise<ApiKey>;
  attachDomainWithApiKey: (p: AttachDomainWithApiKeyDto) => Promise<ApiKey>;
}

export interface ApiKeyServiceInterface {
  createApiKey: (p: CreateApiKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  updateApiKey: (p: UpdateApiKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  deleteApiKey: (p: DeleteApiKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  getApiKey: (p: GetApiKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey & { domain: Domain | null };
    }>
  >;
  getApiKeys: (p: GetApiKeysDto) => Promise<
    ResponseDataType<{
      apiKeys: (ApiKey & { domain: Domain | null })[];
    }>
  >;
  getApiKeyByKey: (p: GetApiKeyByKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  attachDomainWithApiKey: (p: AttachDomainWithApiKeyDto) => Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
}

export interface ApiKeyControllerInterface {
  createApiKey(
    body: CreateApiKeyBodyDto,
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  updateApiKey(
    apiKeyId: string,
    data: UpdateApiKeyBodyDto,
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  deleteApiKey(
    apiKeyId: ApiKey['id'],
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
  getApiKey(
    apiKeyId: ApiKey['id'],
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      apiKey: ApiKey & { domain: Domain | null };
    }>
  >;
  getApiKeys(workspace: Workspace): Promise<
    ResponseDataType<{
      apiKeys: (ApiKey & { domain: Domain | null })[];
    }>
  >;
  attachDomainWithApiKey(
    apiKeyId: ApiKey['id'],
    body: AttachDomainWithApiKeyBodyDto,
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      apiKey: ApiKey;
    }>
  >;
}
