import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { LibModule } from './lib/lib.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './lib/jwt/jwt.guard';
import { ApiKeyModule } from './module/api-key/api-key.module';
import { EmailModule } from './module/email/email.module';
import { SmsModule } from './module/sms/sms.module';
import { DatabaseModule } from './database/database.module';
import { WorkspaceModule } from './module/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LibModule,
    ApiKeyModule,
    EmailModule,
    SmsModule,
    DatabaseModule,
    WorkspaceModule,
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
