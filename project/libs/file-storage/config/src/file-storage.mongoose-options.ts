import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';
import { ConfigAlias } from '@project/shared/core';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          host: config.get<string>(ConfigAlias.AppMongoDbHost),
          port: config.get<string>(ConfigAlias.AppMongoDbPort),
          user: config.get<string>(ConfigAlias.AppMongoDbUser),
          password: config.get<string>(ConfigAlias.AppMongoDbPassword),
          database: config.get<string>(ConfigAlias.AppMongoDbDatabase),
          authDatabase: config.get<string>(ConfigAlias.AppMongoDbAuthBase)
        })
      }
    },
    inject: [ConfigService]
  }
}
