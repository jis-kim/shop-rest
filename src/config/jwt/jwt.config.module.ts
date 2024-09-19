import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import jwtConfig from './jwt.config';
import { JwtConfigService } from './jwt.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
      validationSchema: Joi.object({
        ACCESS_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}
