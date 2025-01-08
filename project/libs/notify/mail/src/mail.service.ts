import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Subscriber } from '@project/shared/core';
import { notifyConfig } from '@project/notify/config';

import { DEFAULT_ADD_SUBCRIBER_TEMPLATE, EMAIL_ADD_SUBSCRIBER_SUBJECT } from './mail.constant';

@Injectable()
export class MailService {
  @Inject(notifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof notifyConfig>

  constructor(private readonly mailerService: MailerService) { }

  public async sendNotifyNewSubscriber(subscriber: Subscriber, template: string = DEFAULT_ADD_SUBCRIBER_TEMPLATE) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mailSmtp.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template,
      context: {
        name: subscriber.name,
        email: subscriber.email
      }
    })
  }
}
