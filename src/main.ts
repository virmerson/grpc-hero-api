import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  //app.useGlobalPipes(new ValidationPipe());
  //app.useLogger(app.get(Logger));
  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
