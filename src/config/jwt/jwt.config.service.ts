import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    const secret = this.configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT access secret is not defined');
    }
    return secret;
  }
}
