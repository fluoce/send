import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DomainCore } from './domain.core';
import { CreateDomainDto, DomainDto, UpdateDomainDto } from './domain.dto';
import { ResponseDataType } from 'src/types/response.type';
import { domainRegex } from 'src/config/regex';
import { Domain } from 'src/config/database';

@Injectable()
export class DomainService {
  constructor(private readonly domainCore: DomainCore) {}

  async createDomain({
    domain,
    workspaceId,
  }: CreateDomainDto): Promise<ResponseDataType> {
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

  async updateDomain({
    domainId,
    status,
    workspaceId,
  }: UpdateDomainDto): Promise<ResponseDataType> {
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

  async deleteDomain({
    domainId,
    workspaceId,
  }: DomainDto): Promise<ResponseDataType> {
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

  async getDomains({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<ResponseDataType> {
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

  async getDomain({
    domainId,
    workspaceId,
  }: DomainDto): Promise<ResponseDataType> {
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

  async getVerifiedDomains({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<ResponseDataType> {
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

  async getWorkspaceVerifiedDomainById({
    domainId,
    workspaceId,
  }: {
    domainId: string;
    workspaceId: string;
  }): Promise<
    ResponseDataType & {
      domain: Domain;
    }
  > {
    const verifiedDomain = await this.domainCore.getWorkspaceVerifiedDomainById(
      {
        domainId,
        workspaceId,
      },
    );

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

  async verifyDomain({ domainId, workspaceId }: DomainDto) {
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
        : 'Domain verification is pending',
      domain,
    };
  }
}
