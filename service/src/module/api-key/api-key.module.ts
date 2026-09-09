import { Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { ApiKeyCore } from './api-key.core';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyCore],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
