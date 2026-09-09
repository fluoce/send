import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { User } from 'src/decorator/user.decorator';
import type { UserPayload } from 'src/types/user-payload.types';
import {
  CreateWorkspaceBodyDto,
  UpdateWorkspaceBodyDto,
} from './workspace.dto';
import { WorkspaceGuard } from './workspace.guard';
import { Workspace } from 'src/decorator/workspace.decorator';
import type { Workspace as WorkpsaceType } from 'src/config/database';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @Body() body: CreateWorkspaceBodyDto,
    @User() user: UserPayload,
  ) {
    return await this.workspaceService.createWorkspace({
      name: body.name,
      userId: user.sub,
    });
  }

  @Get('trash')
  async getTrashWorkspaces(@User() user: UserPayload) {
    return await this.workspaceService.getTrashWorkspaces({
      userId: user.sub,
    });
  }

  @UseGuards(WorkspaceGuard)
  @Patch(':workspaceId')
  async updateWorkspace(
    @Body() body: UpdateWorkspaceBodyDto,
    @Workspace()
    workspace: WorkpsaceType,
  ) {
    return await this.workspaceService.updateWorkspace({
      name: body.name,
      status: body.status,
      workspaceId: workspace.id,
      userId: workspace.userId,
    });
  }

  @Get(':workspaceId')
  async getWorkspace(
    @Param('workspaceId') workspaceId: string,
    @User() user: UserPayload,
  ) {
    return await this.workspaceService.getWorkspace({
      userId: user.sub,
      workspaceId,
    });
  }

  @Get()
  async getWorkspaces(@User() user: UserPayload) {
    return await this.workspaceService.getWorkspaces({
      userId: user.sub,
    });
  }

  @UseGuards(WorkspaceGuard)
  @Delete(':workspaceId')
  async deleteWorkspace(@Workspace() workspace: WorkpsaceType) {
    return await this.workspaceService.deleteWorkspace({
      userId: workspace.userId,
      workspaceId: workspace.id,
    });
  }
}
