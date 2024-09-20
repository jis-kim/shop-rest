import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtConfigModule } from '@/config/jwt/jwt.config.module';
import { JwtConfigService } from '@/config/jwt/jwt.config.service';
import { Member } from '@/entities/member.entity';
import { LoggingModule } from '@/logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: (jwtConfigService: JwtConfigService): JwtModuleOptions => ({
        secret: jwtConfigService.secret,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [JwtConfigService],
    }),
    LoggingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
