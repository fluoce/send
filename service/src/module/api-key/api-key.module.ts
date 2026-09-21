import { Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { ApiKeyCore } from './api-key.core';
import { WorkspaceModule } from '../workspace/workspace.module';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [WorkspaceModule, DomainModule],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyCore],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
