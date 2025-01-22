import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Subscriber } from '@project/shared/core';
import { notifyConfig } from '@project/notify/config';
import { PostRdo } from '@project/blog/blog-post';

import { ADD_SUBCRIBER_TEMPLATE, ADD_SUBSCRIBER_SUBJECT, NEWS_LETTER_SUBJECT, NEWS_LETTER_TEMPLATE } from './mail.constant';

@Injectable()
export class MailService {
  @Inject(notifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof notifyConfig>;

  constructor(
    private readonly mailerService: MailerService
  ) { }

  public async sendNotifyNewSubscriber(subscriber: Subscriber): Promise<void> {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mailSmtp.from,
      to: subscriber.email,
      subject: ADD_SUBSCRIBER_SUBJECT,
      template: ADD_SUBCRIBER_TEMPLATE,
      context: {
        name: subscriber.name,
        email: subscriber.email
      }
    });
  }

  public async sendNotifyNewsLetter(recipients: string[], posts: PostRdo[]): Promise<void> {
    const sendMailOptions: ISendMailOptions = {
      from: this.notifyConfig.mailSmtp.from,
      subject: NEWS_LETTER_SUBJECT,
      //! может сразу "html:"? просто ссылки?
      template: NEWS_LETTER_TEMPLATE,
      context: { posts }
    };

    for (const recipient of recipients) {
      await this.mailerService.sendMail({ ...sendMailOptions, to: recipient });
    }
  }
}
