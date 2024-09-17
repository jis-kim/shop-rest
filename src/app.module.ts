import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/app.config.module';
import { DatabaseConfigModule } from './config/database/database.config.module';
import { DatabaseConfigService } from './config/database/database.config.service';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: DatabaseConfigService,
    }),
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
