import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { DashboardCore } from './dashboard.core';

@Module({
  imports: [WorkspaceModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardCore],
})
export class DashboardModule {}
