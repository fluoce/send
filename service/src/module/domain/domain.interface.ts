import { Domain } from 'src/config/database';
import {
  CheckVerifiedDomainDto,
  CreateDomainDto,
  DeleteDomainDto,
  GetDomainDto,
  GetDomainsDto,
  GetSesIdentityForDomain,
  GetVerifiedDomainByIdForWorkspace,
  GetVerifyedDomainDto,
  GetVerifyedDomainsDto,
  UpdateDomainDto,
  VerifyDomainDto,
} from './domain.dto';
import { GetEmailIdentityCommandOutput } from '@aws-sdk/client-sesv2';

export interface DomainCoreInterface {
  createDomain: (p: CreateDomainDto) => Promise<Domain>;
  updateDomain: (p: UpdateDomainDto) => Promise<Domain>;
  deleteDomain: (p: DeleteDomainDto) => Promise<Domain>;
  getDomain: (p: GetDomainDto) => Promise<Domain>;
  getDomains: (p: GetDomainsDto) => Promise<Domain[]>;
  getVerifiedDomain: (p: GetVerifyedDomainDto) => Promise<Domain | null>;
  getVerifiedDomains: (p: GetVerifyedDomainsDto) => Promise<Domain[]>;
  checkVerifiedDomain: (p: CheckVerifiedDomainDto) => Promise<Domain | null>;
  getVerifiedDomainByIdForWorkspace: (
    p: GetVerifiedDomainByIdForWorkspace,
  ) => Promise<Domain | null>;
  getSesIdentityForDomain: (
    p: GetSesIdentityForDomain,
  ) => Promise<GetEmailIdentityCommandOutput>;
  verifyDomain: (p: VerifyDomainDto) => Promise<Domain & { verified: boolean }>;
}
