import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { getMongoConnectionString } from '@project/shared/helpers';

export function getMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          host: config.get<string>('application.db.host'),
          port: config.get<string>('application.db.port'),
          user: config.get<string>('application.db.user'),
          password: config.get<string>('application.db.password'),
          database: config.get<string>('application.db.name'),
          authDatabase: config.get<string>('application.db.authBase')
        })
      }
    },
    inject: [ConfigService]
  }
}
