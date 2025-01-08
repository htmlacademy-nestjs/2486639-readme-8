import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import {
  ConfigAlias, DEFAULT_MONGODB_PORT, DEFAULT_PORT, DEFAULT_RABBIT_PORT,
  DEFAULT_SMTP_PORT, Environment, ENVIRONMENTS
} from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface NotifyConfig {
  environment: string;
  port: number;
  mongoDb: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    authBase: string;
  },
  rabbit: {
    host: string;
    port: number;
    user: string;
    password: string;
    queue: string;
    exchange: string;
  },
  mailSmtp: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  }
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS).required(),
  port: Joi.number().port().default(DEFAULT_PORT),
  mongoDb: Joi.object({
    host: Joi.string().valid().hostname(),
    port: Joi.number().port().default(DEFAULT_MONGODB_PORT),
    user: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    authBase: Joi.string().required()
  }),
  rabbit: Joi.object({
    host: Joi.string().valid().hostname().required(),
    port: Joi.number().port().default(DEFAULT_RABBIT_PORT),
    user: Joi.string().required(),
    password: Joi.string().required(),
    queue: Joi.string().required(),
    exchange: Joi.string().required()
  }),
  mailSmtp: Joi.object({
    host: Joi.string().valid().hostname().required(),
    port: Joi.number().port().default(DEFAULT_SMTP_PORT),
    user: Joi.string().required(),
    password: Joi.string().required(),
    from: Joi.string().required()
  })
});

function validateConfig(config: NotifyConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Notify Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): NotifyConfig {
  const config: NotifyConfig = {
    environment: process.env[ConfigAlias.NodeEnv] as Environment,
    port: getPort(ConfigAlias.PortEnv, DEFAULT_PORT),
    mongoDb: {
      host: process.env[ConfigAlias.MongoDbHostEnv],
      port: getPort(ConfigAlias.MongoDbPortEnv, DEFAULT_MONGODB_PORT),
      user: process.env[ConfigAlias.MongoDbUserEnv],
      password: process.env[ConfigAlias.MongoDbPasswordEnv],
      database: process.env[ConfigAlias.MongoDbDatabaseEnv],
      authBase: process.env[ConfigAlias.MongoDbAuthBaseEnv]
    },
    rabbit: {
      host: process.env[ConfigAlias.RabbitHostEnv],
      port: getPort(ConfigAlias.RabbitPortEnv, DEFAULT_RABBIT_PORT),
      user: process.env[ConfigAlias.RabbitUserEnv],
      password: process.env[ConfigAlias.RabbitPasswordEnv],
      queue: process.env[ConfigAlias.RabbitQueueEnv],
      exchange: process.env[ConfigAlias.RabbitExchangeEnv]
    },
    mailSmtp: {
      host: process.env[ConfigAlias.MailSmtpHostEnv],
      port: getPort(ConfigAlias.MailSmtpPortEnv, DEFAULT_SMTP_PORT),
      user: process.env[ConfigAlias.MailSmtpUserEnv],
      password: process.env[ConfigAlias.MailSmtpPasswordEnv],
      from: process.env[ConfigAlias.MailSmtpFromEnv]
    }
  };

  validateConfig(config);

  return config;
}

export const notifyConfig = registerAs(ConfigAlias.Application, getConfig);
