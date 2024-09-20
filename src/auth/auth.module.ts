import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/entities/member.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfigModule } from '@/config/jwt/jwt.config.module';
import { JwtConfigService } from '@/config/jwt/jwt.config.service';
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
})
export class AuthModule {}
