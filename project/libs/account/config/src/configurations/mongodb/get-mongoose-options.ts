import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';

import { ConfigAlias } from '../const';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get<string>(ConfigAlias.MongoDbUsername),
          password: config.get<string>(ConfigAlias.MongoDbPassword),
          host: config.get<string>(ConfigAlias.MongoDbHost),
          port: config.get<string>(ConfigAlias.MongoDbPort),
          authDatabase: config.get<string>(ConfigAlias.MongoDbAuthBase),
          databaseName: config.get<string>(ConfigAlias.MongoDbDatabaseName),
        })
      }
    },
    inject: [ConfigService]
  }
}
