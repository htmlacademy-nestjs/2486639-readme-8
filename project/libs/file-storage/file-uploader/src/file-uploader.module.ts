import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigAlias } from '@project/shared/core';

import { FileUploaderService } from './file-uploader.service';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderRepository } from './file-uploader.repository';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileModel, FileSchema } from './file.model';

@Module({
  imports: [
    ServeStaticModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rootPath = configService.get<string>(ConfigAlias.AppUploadDirectoryPath);
          const serveRoot = configService.get<string>(ConfigAlias.AppServeRoot);

          return [{
            rootPath,
            serveRoot,
            serveStaticOptions: {
              fallthrough: true,
              etag: true
            }
          }]
        }
      }
    ),
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema }
    ])
  ],
  providers: [
    FileUploaderService,
    FileUploaderRepository,
    FileUploaderFactory
  ],
  controllers: [FileUploaderController]
})
export class FileUploaderModule { }
