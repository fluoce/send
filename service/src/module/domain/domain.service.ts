import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DomainCore } from './domain.core';
import {
  CreateDomainDto,
  DeleteDomainDto,
  GetDomainDto,
  GetDomainsDto,
  GetVerifiedDomainByIdForWorkspaceDto,
  GetVerifyedDomainsDto,
  UpdateDomainDto,
  VerifyDomainDto,
} from './domain.dto';
import { domainRegex } from 'src/config/regex';
import { DomainServiceInterface } from './domain.interface';

@Injectable()
export class DomainService implements DomainServiceInterface {
  constructor(private readonly domainCore: DomainCore) {}

  async createDomain({ domain, workspaceId }: CreateDomainDto) {
    if (!domain) {
      throw new ServiceUnavailableException('Domain is required');
    }

    if (!domainRegex.test(domain)) {
      throw new ServiceUnavailableException('Enter a valid domain');
    }

    const domainRecord = await this.domainCore.createDomain({
      domain,
      workspaceId,
    });

    if (!domainRecord) {
      throw new ServiceUnavailableException('Domain creation failed');
    }
    return {
      message: 'Domain created successfully',
      domain: domainRecord,
    };
  }

  async updateDomain({ domainId, status, workspaceId }: UpdateDomainDto) {
    const updatedDomain = await this.domainCore.updateDomain({
      domainId,
      status,
      workspaceId,
    });
    if (!updatedDomain) {
      throw new ServiceUnavailableException('Domain update failed');
    }
    return {
      message: 'Domain updated successfully',
      domain: updatedDomain,
    };
  }

  async deleteDomain({ domainId, workspaceId }: DeleteDomainDto) {
    const domainRecord = await this.domainCore.deleteDomain({
      domainId,
      workspaceId,
    });
    if (!domainRecord) {
      throw new ServiceUnavailableException('Domain delete failed');
    }
    return {
      message: 'Domain deleted successfully',
      domain: domainRecord,
    };
  }

  async getDomain({ domainId, workspaceId }: GetDomainDto) {
    const domain = await this.domainCore.getDomain({
      domainId,
      workspaceId,
    });
    if (!domain) {
      throw new ServiceUnavailableException('Failed to get domain');
    }
    return {
      message: 'Domain fetched successfully',
      domain,
    };
  }

  async getDomains({ workspaceId }: GetDomainsDto) {
    const domains = await this.domainCore.getDomains({
      workspaceId,
    });
    if (!domains) {
      throw new ServiceUnavailableException('Failed to get domains');
    }
    return {
      message: 'Domains fetched successfully',
      domains,
    };
  }

  async getVerifiedDomains({ workspaceId }: GetVerifyedDomainsDto) {
    const domains = await this.domainCore.getVerifiedDomains({
      workspaceId,
    });
    if (!domains) {
      throw new ServiceUnavailableException('Failed to get verified domains');
    }
    return {
      message: 'Verified Domains fetched successfully',
      domains,
    };
  }

  async getVerifiedDomainByIdForWorkspace({
    domainId,
    workspaceId,
  }: GetVerifiedDomainByIdForWorkspaceDto) {
    const verifiedDomain =
      await this.domainCore.getVerifiedDomainByIdForWorkspace({
        domainId,
        workspaceId,
      });

    if (!verifiedDomain) {
      throw new BadRequestException(
        'Verified domain not found for this workspace',
      );
    }
    return {
      message: 'Verified Domains fetched successfully',
      domain: verifiedDomain,
    };
  }

  async verifyDomain({ domainId, workspaceId }: VerifyDomainDto) {
    const domain = await this.domainCore.verifyDomain({
      domainId,
      workspaceId,
    });

    if (!domain) {
      throw new ServiceUnavailableException('Failed to verify domain');
    }

    return {
      message: domain?.verified
        ? 'Domain has been verified successfully'
        : domain?.awsSesStatus === 'FAILED'
          ? 'The DNS record is no longer valid. Please delete this domain record and try again.'
          : domain?.awsSesStatus
            ? `Domain verification is ${domain?.awsSesStatus}`
            : 'Domain verification is pending',

      domain,
    };
  }
}
