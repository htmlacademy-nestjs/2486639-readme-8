import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ConfigAlias, DEFAULT_PORT, Environment, ENVIRONMENTS } from '@project/shared/core';
import { getPort } from '@project/shared/helpers';

export interface ApiConfig {
  environment: string;
  port: number;
  account: {
    serviceUrl: string;
    authRoute: string;
  }
  blog: {
    serviceUrl: string;
    postsRoute: string;
    postCommentsRoute: string;
    postLikesRoute: string;
    subscriptionsRoute: string;
  }
  fileStorage: {
    serviceUrl: string;
    uploadRoute: string;
  }
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS).required().label(ConfigAlias.NodeEnv),
  port: Joi.number().port().default(DEFAULT_PORT),
  account: Joi.object({
    serviceUrl: Joi.string().required().label(ConfigAlias.AccountServiceUrlEnv),
    authRoute: Joi.string().required().label(ConfigAlias.AccountAuthRouteEnv)
  }),
  blog: Joi.object({
    serviceUrl: Joi.string().required().label(ConfigAlias.BlogServiceUrlEnv),
    postsRoute: Joi.string().required().label(ConfigAlias.BlogPostsRouteEnv),
    postCommentsRoute: Joi.string().required().label(ConfigAlias.BlogPostCommentsRouteEnv),
    postLikesRoute: Joi.string().required().label(ConfigAlias.BlogPostLikesRouteEnv),
    subscriptionsRoute: Joi.string().required().label(ConfigAlias.BlogSubscriptionsRouteEnv)
  }),
  fileStorage: Joi.object({
    serviceUrl: Joi.string().required().label(ConfigAlias.FileStorageServiceUrlEnv),
    uploadRoute: Joi.string().required().label(ConfigAlias.FileStorageUploadRouteEnv)
  })
});

function validateConfig(config: ApiConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Api Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): ApiConfig {
  const config: ApiConfig = {
    environment: process.env[ConfigAlias.NodeEnv] as Environment,
    port: getPort(ConfigAlias.PortEnv, DEFAULT_PORT),
    account: {
      serviceUrl: process.env[ConfigAlias.AccountServiceUrlEnv],
      authRoute: process.env[ConfigAlias.AccountAuthRouteEnv]
    },
    blog: {
      serviceUrl: process.env[ConfigAlias.BlogServiceUrlEnv],
      postsRoute: process.env[ConfigAlias.BlogPostsRouteEnv],
      postCommentsRoute: process.env[ConfigAlias.BlogPostCommentsRouteEnv],
      postLikesRoute: process.env[ConfigAlias.BlogPostLikesRouteEnv],
      subscriptionsRoute: process.env[ConfigAlias.BlogSubscriptionsRouteEnv]
    },
    fileStorage: {
      serviceUrl: process.env[ConfigAlias.FileStorageServiceUrlEnv],
      uploadRoute: process.env[ConfigAlias.FileStorageUploadRouteEnv]
    }
  };

  validateConfig(config);

  return config;
}

export const apiConfig = registerAs(ConfigAlias.Application, getConfig);
