/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { blogConfig, BlogConfig } from '@project/blog/config';

import { AppModule } from './app/app.module';
import { InjectRequestIdInterceptor, InjectUserIdInterceptor } from '@project/shared/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const swaggerPrefix = 'spec';
  const blogOption = app.get<BlogConfig>(blogConfig.KEY);
  const { port } = blogOption;

  app.setGlobalPrefix(globalPrefix);

  //Swagger
  const documentBuilder = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup(swaggerPrefix, app, documentFactory);
  //

  app.useGlobalInterceptors(
    new InjectRequestIdInterceptor(),
    new InjectUserIdInterceptor()
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`Swagger on: http://localhost:${port}/${swaggerPrefix}`);
}

bootstrap();
