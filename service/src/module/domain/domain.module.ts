import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { DomainCore } from './domain.core';

@Module({
  imports: [WorkspaceModule],
  controllers: [DomainController],
  providers: [DomainService, DomainCore],
  exports: [DomainService],
})
export class DomainModule {}
