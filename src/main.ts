import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app.config.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { LoggingService } from './logging/logging.service';
import { CommonExceptionsFilter } from './common/filter/common-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfigService);
  const loggingService = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));
  app.useGlobalFilters(new CommonExceptionsFilter(loggingService));
  app.setGlobalPrefix('api');

  await app.listen(appConfig.port);
}
bootstrap();
