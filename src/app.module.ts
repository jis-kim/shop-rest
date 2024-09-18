import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/app.config.module';
import { DatabaseConfigModule } from './config/database/database.config.module';
import { DatabaseConfigService } from './config/database/database.config.service';
import { LoggingModule } from './logging/logging.module';
import { AuthModule } from './auth/auth.module';
import { Member } from './entities/member.entity';
import { MemberType } from './entities/member-type.entity';
import { MemberTypePrice } from './entities/member-type-price.entity';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([Member, MemberType, MemberTypePrice, Brand, Product]),
    LoggingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
