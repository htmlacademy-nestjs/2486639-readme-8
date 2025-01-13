import { ConfigService } from '@nestjs/config';

import { ConfigAlias } from '@project/shared/core';

import { getRabbitMQConnectionString } from './common';

export function getRabbitMQOptions() {
  return {
    useFactory: async (config: ConfigService) => ({
      // описание exchanges нужно для их автоматического создания, при первом подключении любым сервисом
      exchanges: [
        {
          name: config.get<string>(ConfigAlias.AppRabbitExchange),
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
