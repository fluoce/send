import { ResponseDataType } from 'src/types/response.type';
import { GetWorkspaceDto } from '../workspace/workspace.dto';
import {
  ApiKey,
  Domain,
  Message,
  Template,
  Workspace,
} from 'src/config/database';

export interface DashboardResponse {
  count: {
    messageCount: {
      title: string;
      total: number;
      statusCount?: Record<Message['status'], number>;
    };
    apiKeyCount: {
      title: string;
      total: number;
      statusCount?: Record<ApiKey['status'], number>;
    };
    domainCount: {
      title: string;
      total: number;
      statusCount?: Record<Domain['status'], number>;
    };
    templateCount: {
      title: string;
      total: number;
      statusCount?: Record<Template['status'], number>;
    };
  };
  messages: Message[];
}

export interface DashboardCoreInterface {
  getDashboard: (p: GetWorkspaceDto) => Promise<DashboardResponse>;
}
export interface DashboardServiceInterface {
  getDashboard: (p: GetWorkspaceDto) => Promise<
    ResponseDataType<{
      dashboard: DashboardResponse;
    }>
  >;
}
export interface DashboardControllerInterface {
  getDashboard: (workspace: Workspace) => Promise<
    ResponseDataType<{
      dashboard: DashboardResponse;
    }>
  >;
}

/**
 * Sample response for DashboardResponse:
 *
 * [
 *   {
 *     title: 'Messages',
 *     total: 150,
 *     statusCount: {
 *       DELIVERED: 120,
 *       FAILED: 20,
 *       PENDING: 10
 *     }
 *   },
 *   {
 *     title: 'API Keys',
 *     total: 4,
 *     statusCount: {
 *       ACTIVE: 2,
 *       DEACTIVE: 1,
 *       SUSPEND: 1
 *     }
 *   },
 *   {
 *     title: 'Domains',
 *     total: 3,
 *     statusCount: {
 *       VERIFIED: 2,
 *       PENDING: 1,
 *       FAILED: 0,
 *       DISABLED: 0
 *     }
 *   },
 *   {
 *     title: 'Templates',
 *     total: 6,
 *     statusCount: {
 *       PUBLISH: 4,
 *       DRAFT: 2
 *     }
 *   }
 * ]
 */
