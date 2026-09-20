import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify, importSPKI } from 'jose';
import { env } from 'src/config/env';

@Injectable()
export class JwtService implements OnModuleInit {
  private publicKey!: CryptoKey;
  private issuer!: string;

  async onModuleInit() {
    const key = env().jwt.publicKey;
    const issuer = env().jwt.issuer;

    if (!key) {
      throw new Error('JWT_PUBLIC_KEY is not set');
    }

    if (!issuer) {
      throw new Error('JWT_ISSUER is not set');
    }

    this.publicKey = await importSPKI(key, 'RS256');
    this.issuer = issuer;
  }

  async verify(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.publicKey, {
        algorithms: ['RS256'],
        issuer: this.issuer,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
