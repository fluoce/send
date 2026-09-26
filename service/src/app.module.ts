import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { LibModule } from './lib/lib.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './lib/jwt/jwt.guard';
import { ApiKeyModule } from './module/api-key/api-key.module';
import { DatabaseModule } from './database/database.module';
import { WorkspaceModule } from './module/workspace/workspace.module';
import { DomainModule } from './module/domain/domain.module';
import { TemplateModule } from './module/template/template.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LibModule,
    DatabaseModule,
    WorkspaceModule,
    ApiKeyModule,
    DomainModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
