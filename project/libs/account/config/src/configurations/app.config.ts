import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_PORT, Environment, ENVIRONMENTS } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface ApplicationConfig {
  environment: string;
  port: number;
  fileStorageServiceUrl: string;
}

const validationSchema =
  Joi.object({
    environment: Joi.string().valid(...ENVIRONMENTS).required().label(ConfigAlias.NodeEnv),
    port: Joi.number().port().default(DEFAULT_PORT),
    fileStorageServiceUrl: Joi.string().required().label(ConfigAlias.FileStorageServiceUrlEnv)
  });

function validateConfig(config: ApplicationConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Account Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): ApplicationConfig {
  const config: ApplicationConfig = {
    environment: process.env[ConfigAlias.NodeEnv] as Environment,
    port: getPort(ConfigAlias.PortEnv, DEFAULT_PORT),
    fileStorageServiceUrl: process.env[ConfigAlias.FileStorageServiceUrlEnv]
  };

  validateConfig(config);

  return config;
}

export const applicationConfig = registerAs(ConfigAlias.Application, getConfig);
