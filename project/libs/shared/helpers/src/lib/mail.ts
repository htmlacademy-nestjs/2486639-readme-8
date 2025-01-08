import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface'; // MailerAsyncOptions не объявлен в node_modules\@nestjs-modules\mailer\dist\index.d.ts
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // HandlebarsAdapter так же
import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';

import { ConfigAlias } from '@project/shared/core';

export function getMailerAsyncOptions(): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get<string>(ConfigAlias.AppMailSmtpHost),
          port: configService.get<number>(ConfigAlias.AppMailSmtpPort),
          secure: false,
          auth: {
            user: configService.get<string>(ConfigAlias.AppMailSmtpUser),
            pass: configService.get<string>(ConfigAlias.AppMailSmtpPassword)
          }
        },
        defaults: {
          from: configService.get<string>(ConfigAlias.AppMailSmtpFrom)
        },
        template: {
          dir: resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }
    },
    inject: [ConfigService]
  }
}
