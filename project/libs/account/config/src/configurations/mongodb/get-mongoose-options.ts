import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';
import { ConfigAlias } from '@project/shared/core';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          user: config.get<string>(ConfigAlias.MongoDbUser),
          password: config.get<string>(ConfigAlias.MongoDbPassword),
          host: config.get<string>(ConfigAlias.MongoDbHost),
          port: config.get<string>(ConfigAlias.MongoDbPort),
          authDatabase: config.get<string>(ConfigAlias.MongoDbAuthBase),
          database: config.get<string>(ConfigAlias.MongoDbDatabase),
        })
      }
    },
    inject: [ConfigService]
  }
}
