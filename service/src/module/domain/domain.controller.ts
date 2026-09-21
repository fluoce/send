import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { DomainService } from './domain.service';
import { Workspace } from 'src/decorator/workspace.decorator';
import type { Workspace as WorkspaceType } from 'src/config/database';
import { CreateDomainBodyDto, UpdateDomainBodyDto } from './domain.dto';

@UseGuards(WorkspaceGuard)
@Controller('workspace/:workspaceId/domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  async createDomain(
    @Body() body: CreateDomainBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.domainService.createDomain({
      domain: body.domain,
      workspaceId: workspace.id,
    });
  }

  @Patch(':domainId')
  async updateDomain(
    @Param('domainId') domainId: string,
    @Body() body: UpdateDomainBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.domainService.updateDomain({
      domainId,
      status: body.status,
      workspaceId: workspace.id,
    });
  }

  @Delete(':domainId')
  async deleteDomain(
    @Param('domainId') domainId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.domainService.deleteDomain({
      domainId,
      workspaceId: workspace.id,
    });
  }

  @Get()
  async getDomains(@Workspace() workspace: WorkspaceType) {
    return await this.domainService.getDomains({
      workspaceId: workspace.id,
    });
  }

  @Get('verified')
  async getVerifiedDomain(@Workspace() workspace: WorkspaceType) {
    return await this.domainService.getVerifiedDomains({
      workspaceId: workspace.id,
    });
  }

  @Get(':domainId')
  async getDomain(
    @Param('domainId') domainId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.domainService.getDomain({
      domainId,
      workspaceId: workspace.id,
    });
  }
}
