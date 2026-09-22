import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { DomainCore } from './domain.core';
import { sesProvider } from 'src/config/ses';

@Module({
  imports: [WorkspaceModule],
  controllers: [DomainController],
  providers: [DomainService, DomainCore, sesProvider],
  exports: [DomainService],
})
export class DomainModule {}
