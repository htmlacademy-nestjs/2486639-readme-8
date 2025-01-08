import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { getMongooseOptions, NotifyConfigModule } from '@project/notify/config';
import { EmailSubscriberModule } from '@project/notify/email-subsriber';
import { MailModule } from '@project/notify/mail';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyConfigModule,
    MailModule,
    EmailSubscriberModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
