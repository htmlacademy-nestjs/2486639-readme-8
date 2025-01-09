import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from '@project/account/authentication'
import { AccountConfigModule, getMongooseOptions } from '@project/account/config'

@Module({
  imports: [
    AuthenticationModule,
    AccountConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    )
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
