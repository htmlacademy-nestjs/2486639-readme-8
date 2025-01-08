import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from '@project/account/authentication'
import { BlogUserModule } from '@project/account/blog-user'
import { AccountConfigModule, getMongooseOptions } from '@project/account/config'
import { NotifyModule } from '@project/account/notify';

@Module({
  imports: [
    AuthenticationModule,
    BlogUserModule,
    AccountConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    ),
    NotifyModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
