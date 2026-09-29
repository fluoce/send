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
import { TemplateControllerInterface } from './template.interface';
import {
  CreateTemplateBodyDto,
  UpdateTemplateMetaBodyDto,
} from './template.dto';
import type { Workspace as WorkspaceType } from 'src/config/database';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { TemplateService } from './template.service';
import { Workspace } from 'src/decorator/workspace.decorator';

@UseGuards(WorkspaceGuard)
@Controller('workspace/:workspaceId/template')
export class TemplateController implements TemplateControllerInterface {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async createTemplate(
    @Body() body: CreateTemplateBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.templateService.createTemplate({
      name: body.name,
      workspaceId: workspace.id,
    });
  }

  @Patch(':templateId')
  async updateTemplateMeta(
    @Param() templateId: string,
    @Body() body: UpdateTemplateMetaBodyDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return this.templateService.updateTemplateMeta({
      templateId,
      name: body.name,
      status: body.status,
      workspaceId: workspace.id,
    });
  }

  @Delete(':templateId')
  async deleteTemplate(
    @Param() templateId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.templateService.deleteTemplate({
      templateId,
      workspaceId: workspace.id,
    });
  }

  @Get(':templateId')
  async getTemplate(
    @Param() templateId: string,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.templateService.getTemplate({
      templateId,
      workspaceId: workspace.id,
    });
  }

  @Get()
  async getTemplates(@Workspace() workspace: WorkspaceType) {
    return await this.templateService.getTemplates({
      workspaceId: workspace.id,
    });
  }
}
