import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TemplateControllerInterface } from './template.interface';
import { CreateTemplateBodyDto, DeleteTemplateDto } from './template.dto';
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

  @Delete()
  async deleteTemplate(
    @Body() body: DeleteTemplateDto,
    @Workspace() workspace: WorkspaceType,
  ) {
    return await this.templateService.deleteTemplate({
      templateId: body.templateId,
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
