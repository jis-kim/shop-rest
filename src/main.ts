import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app.config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfigService);
  await app.listen(appConfig.port);
}
bootstrap();
