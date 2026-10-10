import { Injectable } from '@nestjs/common';
import { GetDashboardDto } from './dashboard.dto';
import {
  DashboardCoreInterface,
  DashboardResponse,
} from './dashboard.interface';

@Injectable()
export class DashboardCore implements DashboardCoreInterface {
  async getDashboard({ workspaceId }: GetDashboardDto) {
    return {
      count: {
        messageCount: {
          title: 'Messages',
          total: 150,
          statusCount: {
            DELIVERED: 120,
            FAILED: 20,
            PENDING: 10,
          },
        },
        apiKeyCount: {
          title: 'Keys',
          total: 4,
          statusCount: {
            ACTIVE: 2,
            DEACTIVE: 1,
            SUSPEND: 1,
          },
        },
        domainCount: {
          title: 'Domains',
          total: 3,
          statusCount: {
            VERIFIED: 2,
            PENDING: 1,
            FAILED: 0,
            DISABLED: 0,
          },
        },
        templateCount: {
          title: 'Templates',
          total: 6,
          statusCount: {
            PUBLISH: 4,
            DRAFT: 2,
          },
        },
      },
      messages: [
        {
          id: '1',
          workspaceId: workspaceId,
          apiKeyId: 'key1',
          status: 'DELIVERED',
          type: 'EMAIL',
          from: 'team@workspace.com',
          to: [
            'user1@example.com',
            'altuser1@example.com',
            'extra1@example.com',
            'sample1@example.com',
            'test1@example.com',
          ],
          content: 'Welcome to our service!',
          createdAt: new Date('2024-06-15T09:12:40Z'),
          updatedAt: new Date('2024-06-15T09:14:20Z'),
        },
        {
          id: '2',
          workspaceId: workspaceId,
          apiKeyId: 'key2',
          status: 'FAILED',
          type: 'SMS',
          from: 'ServiceSMS',
          to: [
            '+1234567890',
            '+1987654321',
            '+1029384756',
            '+1928374650',
            '+1827364555',
          ],
          content: 'SMS could not be delivered.',
          createdAt: new Date('2024-06-14T14:02:10Z'),
          updatedAt: new Date('2024-06-14T14:03:10Z'),
        },
        {
          id: '3',
          workspaceId: workspaceId,
          apiKeyId: 'key2',
          status: 'PENDING',
          type: 'EMAIL',
          from: 'admin@workspace.com',
          to: [
            'user2@example.com',
            'pending2@example.com',
            'waituser2@example.com',
            'sample2@example.com',
          ],
          content: 'Please confirm your email.',
          createdAt: new Date('2024-06-16T10:03:00Z'),
          updatedAt: new Date('2024-06-16T10:03:00Z'),
        },
        {
          id: '4',
          workspaceId: workspaceId,
          apiKeyId: 'key1',
          status: 'DELIVERED',
          type: 'SMS',
          from: 'ServiceSMS',
          to: ['+2222222222', '+3333333333', '+4444444444', '+5555555555'],
          content: 'Your code is 123456.',
          createdAt: new Date('2024-06-17T11:20:45Z'),
          updatedAt: new Date('2024-06-17T11:20:50Z'),
        },
        {
          id: '5',
          workspaceId: workspaceId,
          apiKeyId: 'key3',
          status: 'FAILED',
          type: 'EMAIL',
          from: 'no-reply@workspace.com',
          to: [
            'failuser@example.com',
            'failtwo@example.com',
            'samplefail@example.com',
            'extrafail@example.com',
            'unreach@example.com',
          ],
          content: 'Message delivery failed.',
          createdAt: new Date('2024-06-15T18:53:39Z'),
          updatedAt: new Date('2024-06-15T18:54:44Z'),
        },
      ],
    } as DashboardResponse;
  }
}
