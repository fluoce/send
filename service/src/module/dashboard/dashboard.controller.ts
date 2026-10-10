import { Controller, Get, UseGuards } from '@nestjs/common';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { DashboardControllerInterface } from './dashboard.interface';
import { Workspace } from 'src/decorator/workspace.decorator';
import { type Workspace as WorkspaceType } from 'src/config/database';
import { DashboardService } from './dashboard.service';

@UseGuards(WorkspaceGuard)
@Controller('workspace/:workspaceId/dashboard')
export class DashboardController implements DashboardControllerInterface {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Workspace() workspace: WorkspaceType) {
    return await this.dashboardService.getDashboard({
      workspaceId: workspace.id,
    });
  }
}
