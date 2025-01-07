import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';
import { ConfigAlias } from '@project/shared/core';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          host: config.get<string>(ConfigAlias.ApplicationMongoDbHost),
          port: config.get<string>(ConfigAlias.ApplicationMongoDbPort),
          user: config.get<string>(ConfigAlias.ApplicationMongoDbUser),
          password: config.get<string>(ConfigAlias.ApplicationMongoDbPassword),
          database: config.get<string>(ConfigAlias.ApplicationMongoDbDatabase),
          authDatabase: config.get<string>(ConfigAlias.ApplicationMongoDbAuthBase)
        })
      }
    },
    inject: [ConfigService]
  }
}
