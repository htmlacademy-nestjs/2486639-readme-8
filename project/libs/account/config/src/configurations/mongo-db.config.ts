import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';

import { MongoConfiguration } from './mongodb/mongo.env';
import { DEFAULT_MONGODB_PORT } from './mongodb/mongo.const';
import { ConfigAlias } from './const';

export interface MongoDbConfig {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
  authBase: string;
}

async function getMongoDbConfig(): Promise<MongoConfiguration> {
  const config = plainToClass(MongoConfiguration, {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT, 10) : DEFAULT_MONGODB_PORT,
    authBase: process.env.MONGO_AUTH_BASE,
    databaseName: process.env.MONGO_DB
  });

  await config.validate();

  return config;
}

export const mongoDbConfig = registerAs(ConfigAlias.MongoDb, async (): Promise<ConfigType<typeof getMongoDbConfig>> => {
  return getMongoDbConfig();
});
