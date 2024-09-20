import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app/app.config.module';
import { DatabaseConfigModule } from './config/database/database.config.module';
import { DatabaseConfigService } from './config/database/database.config.service';
import { Brand } from './entities/brand.entity';
import { MemberTypePrice } from './entities/member-type-price.entity';
import { MemberType } from './entities/member-type.entity';
import { Member } from './entities/member.entity';
import { Product } from './entities/product.entity';
import { LoggingModule } from './logging/logging.module';
import { ProductModule } from './product/product.module';

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
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
