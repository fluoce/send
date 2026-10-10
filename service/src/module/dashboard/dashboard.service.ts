import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DashboardCore } from './dashboard.core';
import { DashboardServiceInterface } from './dashboard.interface';
import { GetDashboardDto } from './dashboard.dto';

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(private readonly dashboardCore: DashboardCore) {}

  async getDashboard(data: GetDashboardDto) {
    const dashboard = await this.dashboardCore.getDashboard(data);
    if (!dashboard) {
      throw new ServiceUnavailableException('Unable to load dashboard');
    }
    return {
      dashboard,
      message: 'Dashboard retrieved successfully',
    };
  }
}
