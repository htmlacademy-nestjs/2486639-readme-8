import { ConfigService } from '@nestjs/config';

import { ConfigAlias } from '@project/shared/core';

import { getRabbitMQConnectionString } from './common';

export function getRabbitMQOptions() {
  return {
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>(ConfigAlias.AppRabbitQueue),
          type: 'direct'
        }
      ],
      uri: getRabbitMQConnectionString({
        host: config.get<string>(ConfigAlias.AppRabbitHost),
        port: config.get<string>(ConfigAlias.AppRabbitPort),
        user: config.get<string>(ConfigAlias.AppRabbitUser),
        password: config.get<string>(ConfigAlias.AppRabbitPassword)
      }),
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true
    }),
    inject: [ConfigService]
  }
}
