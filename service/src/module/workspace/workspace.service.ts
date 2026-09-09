import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ResponseDataType } from 'src/types/response.type';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  UpdateWorkspaceDto,
} from './workspace.dto';
import { WorkspaceCore } from './workspace.core';
import { Workspace } from 'src/decorator/workspace.decorator';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceCore: WorkspaceCore) {}

  async createWorkspace(data: CreateWorkspaceDto): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.createWorkspace(data);
    if (!workspace) {
      throw new ServiceUnavailableException('Unable to create workspace');
    }
    return {
      workspace,
      message: 'workspace created successfully',
    };
  }

  async updateWorkspace(data: UpdateWorkspaceDto): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.updateWorkspace(data);
    if (!workspace) {
      throw new NotFoundException('Workspace not found or has been deleted');
    }
    return {
      workspace,
      message: 'Workspace updated successfully',
    };
  }

  async getWorkspace({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.getWorkspace({
      userId,
      workspaceId,
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      workspace,
      message: 'workspace fetched successfully',
    };
  }

  async getWorkspaces({
    userId,
  }: {
    userId: string;
  }): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.getWorkspaces({
      userId,
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      workspace,
      message: 'workspaces fetched successfully',
    };
  }

  async getTrashWorkspaces({
    userId,
  }: {
    userId: string;
  }): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.getTrashWorkspaces({
      userId,
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      workspace,
      message: 'Trash workspaces fetched successfully',
    };
  }

  async deleteWorkspace(data: DeleteWorkspaceDto): Promise<ResponseDataType> {
    const workspace = await this.workspaceCore.deleteWorkspace(data);
    if (!Workspace) {
      throw new NotFoundException(
        'Workspace not found or could not be permanently deleted',
      );
    }
    return {
      workspace,
      message: 'workspace permanently deleted',
    };
  }
}
