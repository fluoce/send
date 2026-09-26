import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  GetTrashWorkspacesDto,
  GetWorkspaceDto,
  GetWorkspacesDto,
  UpdateWorkspaceDto,
} from './workspace.dto';
import { WorkspaceCore } from './workspace.core';
import { Workspace } from 'src/decorator/workspace.decorator';
import { WorkspaceServiceInterface } from './workspace.interface';

@Injectable()
export class WorkspaceService implements WorkspaceServiceInterface {
  constructor(private readonly workspaceCore: WorkspaceCore) {}

  async createWorkspace(data: CreateWorkspaceDto) {
    const workspace = await this.workspaceCore.createWorkspace(data);
    if (!workspace) {
      throw new ServiceUnavailableException('Unable to create workspace');
    }
    return {
      workspace,
      message: 'workspace created successfully',
    };
  }

  async updateWorkspace(data: UpdateWorkspaceDto) {
    const workspace = await this.workspaceCore.updateWorkspace(data);
    if (!workspace) {
      throw new NotFoundException('Workspace not found or has been deleted');
    }
    return {
      workspace,
      message: 'Workspace updated successfully',
    };
  }

  async deleteWorkspace(data: DeleteWorkspaceDto) {
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

  async getWorkspace({ userId, workspaceId }: GetWorkspaceDto) {
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

  async getWorkspaces({ userId }: GetWorkspacesDto) {
    const workspaces = await this.workspaceCore.getWorkspaces({
      userId,
    });
    if (!workspaces) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      workspaces,
      message: 'workspaces fetched successfully',
    };
  }

  async getTrashWorkspaces({ userId }: GetTrashWorkspacesDto) {
    const workspaces = await this.workspaceCore.getTrashWorkspaces({
      userId,
    });
    if (!workspaces) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      workspaces,
      message: 'Trash workspaces fetched successfully',
    };
  }
}
