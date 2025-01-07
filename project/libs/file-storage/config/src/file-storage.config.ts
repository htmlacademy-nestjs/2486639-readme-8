import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_MONGODB_PORT, DEFAULT_PORT, Environment, ENVIRONMENTS } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface FileStorageConfig {
  environment: string;
  port: number;
  uploadDirectory: string;
  mongoDb: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    authBase: string;
  }
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS).required(),
  port: Joi.number().port().default(DEFAULT_PORT),
  uploadDirectory: Joi.string().required(),
  mongoDb: Joi.object({
    host: Joi.string().valid().hostname(),
    port: Joi.number().port(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    authBase: Joi.string().required()
  })
});

function validateConfig(config: FileStorageConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[FileStorage Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): FileStorageConfig {
  const config: FileStorageConfig = {
    environment: process.env[ConfigAlias.NodeEnv] as Environment,
    port: getPort(ConfigAlias.PortEnv, DEFAULT_PORT),
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
    mongoDb: {
      host: process.env[ConfigAlias.MongoDbHostEnv],
      port: getPort(ConfigAlias.MongoDbPortEnv, DEFAULT_MONGODB_PORT),
      user: process.env[ConfigAlias.MongoDbUserEnv],
      password: process.env[ConfigAlias.MongoDbPasswordEnv],
      database: process.env[ConfigAlias.MongoDbDatabaseEnv],
      authBase: process.env[ConfigAlias.MongoDbAuthBaseEnv]
    }
  };

  validateConfig(config);

  return config;
}

export const fileStorageConfig = registerAs(ConfigAlias.Application, getConfig);
