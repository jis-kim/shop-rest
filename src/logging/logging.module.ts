import { Module, Global } from '@nestjs/common';

import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { AppConfigModule } from 'src/config/app/app.config.module';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [LoggingService, LoggingInterceptor],
  exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {}
