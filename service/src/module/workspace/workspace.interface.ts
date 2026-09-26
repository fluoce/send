import { Workspace } from 'src/config/database';
import {
  CreateWorkspaceBodyDto,
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  GetTrashWorkspacesDto,
  GetWorkspaceDto,
  GetWorkspacesByStatusDto,
  GetWorkspacesDto,
  UpdateWorkspaceBodyDto,
  UpdateWorkspaceDto,
} from './workspace.dto';
import { ResponseDataType } from 'src/types/response.type';
import { UserPayload } from 'src/types/user-payload.types';

export interface WorkspaceCoreInterface {
  createWorkspace: (p: CreateWorkspaceDto) => Promise<Workspace>;
  updateWorkspace: (p: UpdateWorkspaceDto) => Promise<Workspace>;
  deleteWorkspace: (p: DeleteWorkspaceDto) => Promise<Workspace>;
  getWorkspace: (p: GetWorkspaceDto) => Promise<Workspace | null>;
  getWorkspaces: (p: GetWorkspacesDto) => Promise<Workspace[]>;
  getTrashWorkspaces: (p: GetTrashWorkspacesDto) => Promise<Workspace[]>;
  getWorkspacesByStatus: (p: GetWorkspacesByStatusDto) => Promise<Workspace[]>;
}

export interface WorkspaceServiceInterface {
  createWorkspace: (p: CreateWorkspaceDto) => Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;
  updateWorkspace: (p: UpdateWorkspaceDto) => Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;
  deleteWorkspace: (p: DeleteWorkspaceDto) => Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;
  getWorkspace: (p: GetWorkspaceDto) => Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;
  getWorkspaces: (p: GetWorkspacesDto) => Promise<
    ResponseDataType<{
      workspaces: Workspace[];
    }>
  >;
  getTrashWorkspaces: (p: GetTrashWorkspacesDto) => Promise<
    ResponseDataType<{
      workspaces: Workspace[];
    }>
  >;
}

export interface WorkspaceControllerInterface {
  createWorkspace(
    body: CreateWorkspaceBodyDto,
    user: UserPayload,
  ): Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;

  getTrashWorkspaces(user: UserPayload): Promise<
    ResponseDataType<{
      workspaces: Workspace[];
    }>
  >;

  updateWorkspace(
    body: UpdateWorkspaceBodyDto,
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;

  deleteWorkspace(workspace: Workspace): Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;

  getWorkspace(
    workspaceId: string,
    user: UserPayload,
  ): Promise<
    ResponseDataType<{
      workspace: Workspace;
    }>
  >;

  getWorkspaces(user: UserPayload): Promise<
    ResponseDataType<{
      workspaces: Workspace[];
    }>
  >;
}
