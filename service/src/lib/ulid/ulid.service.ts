import { Injectable, Logger } from '@nestjs/common';
import { idPrefix } from 'src/config/id-prefix';
import { ulid, decodeTime } from 'ulid';

@Injectable()
export class UlidService {
  private logger = new Logger(UlidService.name);

  isValidUlid(value: string): boolean {
    try {
      decodeTime(value);
      return true;
    } catch (error) {
      this.logger.log(error);
      return false;
    }
  }

  workspaceId(): string {
    return `${idPrefix.workspace}_${ulid()}`;
  }

  apiKeyId(): string {
    return `${idPrefix.apiKey}_${ulid()}`;
  }

  domainId(): string {
    return `${idPrefix.domain}_${ulid()}`;
  }

  templateId(): string {
    return `${idPrefix.template}_${ulid()}`;
  }
}
