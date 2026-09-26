import { Domain, Workspace } from 'src/config/database';
import {
  CheckVerifiedDomainDto,
  CreateDomainBodyDto,
  CreateDomainDto,
  DeleteDomainDto,
  GetDomainDto,
  GetDomainsDto,
  GetSesDkimStatusDto,
  GetSesIdentityForDomainDto,
  GetVerifiedDomainByIdForWorkspaceDto,
  GetVerifyedDomainDto,
  GetVerifyedDomainsDto,
  MarkAsFailedDomainDto,
  UpdateDomainBodyDto,
  UpdateDomainDto,
  VerifyDomainDto,
} from './domain.dto';
import { GetEmailIdentityCommandOutput } from '@aws-sdk/client-sesv2';
import { ResponseDataType } from 'src/types/response.type';

export interface DomainCoreInterface {
  createDomain: (p: CreateDomainDto) => Promise<Domain>;
  updateDomain: (p: UpdateDomainDto) => Promise<Domain>;
  markAsFailedDomain: (p: MarkAsFailedDomainDto) => Promise<Domain>;
  deleteDomain: (p: DeleteDomainDto) => Promise<Domain>;
  getDomain: (p: GetDomainDto) => Promise<Domain>;
  getDomains: (p: GetDomainsDto) => Promise<Domain[]>;
  getVerifiedDomain: (p: GetVerifyedDomainDto) => Promise<Domain | null>;
  getVerifiedDomains: (p: GetVerifyedDomainsDto) => Promise<Domain[]>;
  checkVerifiedDomain: (p: CheckVerifiedDomainDto) => Promise<Domain | null>;
  getVerifiedDomainByIdForWorkspace: (
    p: GetVerifiedDomainByIdForWorkspaceDto,
  ) => Promise<Domain | null>;
  getSesIdentityForDomain: (
    p: GetSesIdentityForDomainDto,
  ) => Promise<GetEmailIdentityCommandOutput>;
  getSesDkimStatus: (
    p: GetSesDkimStatusDto,
  ) => Promise<GetEmailIdentityCommandOutput | null>;
  verifyDomain: (
    p: VerifyDomainDto,
  ) => Promise<Domain & { verified: boolean; awsSesStatus?: string }>;
}

export interface DomainServiceInterface {
  createDomain: (p: CreateDomainDto) => Promise<
    ResponseDataType<{
      domain: Domain;
    }>
  >;
  updateDomain: (p: UpdateDomainDto) => Promise<
    ResponseDataType<{
      domain: Domain;
    }>
  >;
  deleteDomain: (p: DeleteDomainDto) => Promise<
    ResponseDataType<{
      domain: Domain;
    }>
  >;
  getDomain: (p: GetDomainDto) => Promise<
    ResponseDataType<{
      domain: Domain;
    }>
  >;
  getDomains: (p: GetDomainsDto) => Promise<
    ResponseDataType<{
      domains: Domain[];
    }>
  >;
  getVerifiedDomains: (p: GetVerifyedDomainsDto) => Promise<
    ResponseDataType<{
      domains: Domain[];
    }>
  >;
  getVerifiedDomainByIdForWorkspace: (
    p: GetVerifiedDomainByIdForWorkspaceDto,
  ) => Promise<
    ResponseDataType<{
      domain: Domain | null;
    }>
  >;
  verifyDomain: (p: VerifyDomainDto) => Promise<
    ResponseDataType<{
      domain: (Domain & { verified: boolean; awsSesStatus?: string }) | null;
    }>
  >;
}

export interface DomainControllerInterface {
  createDomain(
    body: CreateDomainBodyDto,
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domain: Domain }>>;

  updateDomain(
    domainId: Domain['id'],
    body: UpdateDomainBodyDto,
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domain: Domain }>>;

  deleteDomain(
    domainId: Domain['id'],
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domain: Domain }>>;

  getDomains(
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domains: Domain[] }>>;

  getVerifiedDomain(
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domains: Domain[] }>>;

  getDomain(
    domainId: Domain['id'],
    workspace: Workspace,
  ): Promise<ResponseDataType<{ domain: Domain }>>;

  verifyDomain(
    domainId: Domain['id'],
    workspace: Workspace,
  ): Promise<
    ResponseDataType<{
      domain: (Domain & { verified: boolean; awsSesStatus?: string }) | null;
    }>
  >;
}
