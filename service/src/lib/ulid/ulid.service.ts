import { Injectable } from '@nestjs/common';
import { idPrefix } from 'src/config/id-prefix';
import { ulid, decodeTime } from 'ulid';

@Injectable()
export class UlidService {
  isValidUlid(value: string): boolean {
    try {
      decodeTime(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  workspaceId(): string {
    return `${idPrefix.workspace}_${ulid()}`;
  }

  apiKeyId(): string {
    return `${idPrefix.apiKey}_${ulid()}`;
  }
}
