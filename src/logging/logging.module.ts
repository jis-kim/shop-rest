import { Module, Global } from '@nestjs/common';

import { LoggingInterceptor } from './logging.interceptor';
import { LoggingService } from './logging.service';

import { AppConfigModule } from '@/config/app/app.config.module';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [LoggingService, LoggingInterceptor],
  exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {}
