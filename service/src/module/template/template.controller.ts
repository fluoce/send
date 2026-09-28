import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TemplateControllerInterface } from './template.interface';
import { CreateTemplateBodyDto } from './template.dto';
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
}
