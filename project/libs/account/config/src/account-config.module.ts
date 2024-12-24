import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { applicationConfig } from './configurations/app.config';
import { mongoDbConfig } from './configurations/mongo-db.config';

const ENV_ACCOUNT_FILE_PATH = 'apps/account/account.dev.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoDbConfig],
      envFilePath: ENV_ACCOUNT_FILE_PATH
    })
  ]
})
export class AccountConfigModule { }
