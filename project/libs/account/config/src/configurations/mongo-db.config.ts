import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';

import { ConfigAlias, DEFAULT_MONGODB_PORT } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

import { MongoDbConfiguration } from './mongodb/mongo-db.env';

export interface MongoDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  authBase: string;
}

async function getMongoDbConfig(): Promise<MongoDbConfiguration> {
  const config = plainToClass(MongoDbConfiguration, {
    host: process.env[ConfigAlias.MongoDbHostEnv],
    port: getPort(ConfigAlias.MongoDbPortEnv, DEFAULT_MONGODB_PORT),
    user: process.env[ConfigAlias.MongoDbUserEnv],
    password: process.env[ConfigAlias.MongoDbPasswordEnv],
    database: process.env[ConfigAlias.MongoDbDatabaseEnv],
    authBase: process.env[ConfigAlias.MongoDbAuthBaseEnv]
  });

  await config.validate();

  return config;
}

export const mongoDbConfig = registerAs(ConfigAlias.AppMongoDb, async (): Promise<ConfigType<typeof getMongoDbConfig>> => {
  return getMongoDbConfig();
});
