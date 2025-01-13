import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_RABBIT_PORT } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface RabbitConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  exchange: string;
}

const validationSchema = Joi.object({
  host: Joi.string().valid().hostname().required().label(ConfigAlias.RabbitHostEnv),
  port: Joi.number().port().default(DEFAULT_RABBIT_PORT),
  user: Joi.string().required().label(ConfigAlias.RabbitUserEnv),
  password: Joi.string().required().label(ConfigAlias.RabbitPasswordEnv),
  exchange: Joi.string().required().label(ConfigAlias.RabbitExchangeEnv),
});

function validateConfig(config: RabbitConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Rabbit Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): RabbitConfig {
  const config: RabbitConfig = {
    host: process.env[ConfigAlias.RabbitHostEnv],
    port: getPort(ConfigAlias.RabbitPortEnv, DEFAULT_RABBIT_PORT),
    user: process.env[ConfigAlias.RabbitUserEnv],
    password: process.env[ConfigAlias.RabbitPasswordEnv],
    exchange: process.env[ConfigAlias.RabbitExchangeEnv]
  };

  validateConfig(config);

  return config;
}

export const rabbitConfig = registerAs(ConfigAlias.AppRabbit, getConfig);
