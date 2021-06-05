import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { AppConfigService } from './config/app/config.service';

async function boostrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get('AppConfigService');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.setGlobalPrefix("/api/v1");
  await app.listen(appConfig.port);
}
boostrap();
