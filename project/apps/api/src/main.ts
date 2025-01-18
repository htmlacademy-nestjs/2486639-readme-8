/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { BearerAuth, BearerAuthOption, ConfigAlias } from '@project/shared/core';
import { InjectBearerAuthInterceptor, RequestIdInterceptor } from '@project/shared/interceptors';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const swaggerPrefix = 'spec';
  const configService = app.get(ConfigService);
  const port = configService.get<number>(ConfigAlias.AppPort);

  app.setGlobalPrefix(globalPrefix);

  //Swagger
  const documentBuilder = new DocumentBuilder()
    .setTitle('Api API')
    .setDescription('The Api API description')
    .setVersion('1.0')
    .addBearerAuth(BearerAuthOption, BearerAuth.AccessToken)
    .addBearerAuth(BearerAuthOption, BearerAuth.RefreshToken)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup(swaggerPrefix, app, documentFactory);
  //

  // Микросервисы и маршруты
  Logger.log(`Account Service on: ${configService.get<number>(ConfigAlias.AppAccountServiceUrl)}`);
  Logger.log(`BlogPost Service on: ${configService.get<number>(ConfigAlias.AppBlogPostServiceUrl)}`);
  Logger.log(`FileStorage Service on: ${configService.get<number>(ConfigAlias.AppFileStorageServiceUrl)}`);
  //

  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new InjectBearerAuthInterceptor()
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`Swagger on: http://localhost:${port}/${swaggerPrefix}`);
}

bootstrap();
