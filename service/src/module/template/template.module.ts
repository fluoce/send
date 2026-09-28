import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { TemplateCore } from './template.core';

@Module({
  imports: [WorkspaceModule],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateCore],
  exports: [TemplateService],
})
export class TemplateModule {}
