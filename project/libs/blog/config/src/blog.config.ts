import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_PORT, DEFAULT_POSTGRES_PORT, Environment, ENVIRONMENTS } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface BlogConfig {
  environment: string;
  port: number;
  fileStorageServiceUrl: string;
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    databaseUrl: string;
  }
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS).required().label(ConfigAlias.NodeEnv),
  port: Joi.number().port().default(DEFAULT_PORT),
  fileStorageServiceUrl: Joi.string().required().label(ConfigAlias.FileStorageServiceUrlEnv),
  postgres: Joi.object({
    host: Joi.string().valid().hostname().required().label(ConfigAlias.PostgresHostEnv),
    port: Joi.number().port().default(DEFAULT_POSTGRES_PORT),
    user: Joi.string().required().label(ConfigAlias.PostgresPortEnv),
    password: Joi.string().required().label(ConfigAlias.PostgresPasswordEnv),
    database: Joi.string().required().label(ConfigAlias.PostgresDatabaseEnv),
    databaseUrl: Joi.string().required().label(ConfigAlias.PostgresDatabaseUrlEnv)
  })
});

function validateConfig(config: BlogConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Blog Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): BlogConfig {
  const config: BlogConfig = {
    environment: process.env[ConfigAlias.NodeEnv] as Environment,
    port: getPort(ConfigAlias.PortEnv, DEFAULT_PORT),
    fileStorageServiceUrl: process.env[ConfigAlias.FileStorageServiceUrlEnv],
    postgres: {
      host: process.env[ConfigAlias.PostgresHostEnv],
      port: getPort(ConfigAlias.PostgresPortEnv, DEFAULT_POSTGRES_PORT),
      user: process.env[ConfigAlias.PostgresUserEnv],
      password: process.env[ConfigAlias.PostgresPasswordEnv],
      database: process.env[ConfigAlias.PostgresDatabaseEnv],
      databaseUrl: process.env[ConfigAlias.PostgresDatabaseUrlEnv]
    }
  };

  validateConfig(config);

  return config;
}

export const blogConfig = registerAs(ConfigAlias.Application, getConfig);
