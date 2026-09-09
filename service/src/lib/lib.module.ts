import { Global, Module } from '@nestjs/common';
import { UlidService } from './ulid/ulid.service';
import { JwtService } from './jwt/jwt.service';

@Global()
@Module({
  providers: [UlidService, JwtService],
  exports: [UlidService, JwtService],
})
export class LibModule {}
