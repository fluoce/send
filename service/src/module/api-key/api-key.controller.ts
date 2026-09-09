import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyBodyDto, UpdateApiKeyBodyDto } from './api-key.dto';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Workspace } from 'src/decorator/workspace.decorator';
import { type Workspace as WorkspaceType } from 'src/config/database';

@UseGuards(WorkspaceGuard)
@Controller('workspace/:workspaceId/api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async createApiKey(
    @Body() body: CreateApiKeyBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return this.apiKeyService.createApiKey({
      name: body.name,
      expireAt: body.expireAt,
      workspaceId: workspace.id,
    });
  }

  @Patch(':apiKeyId')
  async updateApiKey(
    @Param('apiKeyId') apiKeyId: string,
    @Body() data: UpdateApiKeyBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return this.apiKeyService.updateApiKey({
      apiKeyId,
      expireAt: data.expireAt,
      name: data.name,
      status: data.status,
      workspaceId: workspace.id,
    });
  }

  @Delete(':apiKeyId')
  async deleteApiKey(
    @Param('apiKeyId') apiKeyId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return this.apiKeyService.deleteApiKey({
      apiKeyId,
      workspaceId: workspace.id,
    });
  }

  @Get(':apiKeyId')
  async getApiKey(
    @Param('apiKeyId') apiKeyId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return this.apiKeyService.getApiKey({
      apiKeyId,
      workspaceId: workspace.id,
    });
  }

  @Get()
  async getApiKeys(@Workspace() workspace: WorkspaceType) {
    return this.apiKeyService.getApiKeys({ workspaceId: workspace.id });
  }
}
