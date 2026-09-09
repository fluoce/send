import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceCore } from './workspace.core';
import { WorkspaceGuard } from './workspace.guard';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceCore, WorkspaceGuard],
  exports: [WorkspaceGuard, WorkspaceGuard, WorkspaceCore],
})
export class WorkspaceModule {}
