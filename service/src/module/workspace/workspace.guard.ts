import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserPayload } from 'src/types/user-payload.types';
import { WorkspaceCore } from './workspace.core';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly workspacecoreService: WorkspaceCore) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as any).user as UserPayload;
    const userId = user.sub;
    const { workspaceId } = req.params as { workspaceId: string };

    if (!workspaceId) {
      throw new BadRequestException('Workspace Id not provided');
    }

    const workspace = await this.workspacecoreService.getWorkspace({
      userId,
      workspaceId,
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    (req as any).workspace = workspace;

    return true;
  }
}
