import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';
import { ConfigAlias } from '@project/shared/core';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          user: config.get<string>(ConfigAlias.AppMongoDbUser),
          password: config.get<string>(ConfigAlias.AppMongoDbPassword),
          host: config.get<string>(ConfigAlias.AppMongoDbHost),
          port: config.get<string>(ConfigAlias.AppMongoDbPort),
          database: config.get<string>(ConfigAlias.AppMongoDbDatabase),
          authBase: config.get<string>(ConfigAlias.AppMongoDbAuthBase)
        })
      }
    },
    inject: [ConfigService]
  }
}
