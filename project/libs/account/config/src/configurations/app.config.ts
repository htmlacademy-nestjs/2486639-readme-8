import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_PORT, Environment, ENVIRONMENTS } from '@project/shared/core';

export interface ApplicationConfig {
  environment: string;
  port: number;
}

const validationSchema =
  Joi.object({
    environment: Joi.string().valid(...ENVIRONMENTS).required(),
    port: Joi.number().port().default(DEFAULT_PORT),
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
    port: parseInt(process.env[ConfigAlias.ApplicationPortEnv] || `${DEFAULT_PORT}`, 10)
  };

  validateConfig(config);

  return config;
}

export const applicationConfig = registerAs(ConfigAlias.Application, getConfig);
