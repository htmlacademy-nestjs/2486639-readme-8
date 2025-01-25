import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { PostWithUserIdRdo, Subscriber } from '@project/shared/core';
import { notifyConfig } from '@project/notify/config';

import { ADD_SUBCRIBER_TEMPLATE, ADD_SUBSCRIBER_SUBJECT, NEWS_LETTER_SUBJECT, NEWS_LETTER_TEMPLATE } from './mail.constant';

@Injectable()
export class MailService {
  @Inject(notifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof notifyConfig>;

  constructor(
    private readonly mailerService: MailerService
  ) { }

  public async sendNotifyNewSubscriber(subscriber: Subscriber): Promise<void> {
    const { name, email } = subscriber;
    const { mailSmtp: { from } } = this.notifyConfig;
    const sendMailOption: ISendMailOptions = {
      from,
      to: email,
      subject: ADD_SUBSCRIBER_SUBJECT,
      template: ADD_SUBCRIBER_TEMPLATE,
      context: { name, email }
    };

    await this.mailerService.sendMail(sendMailOption);
  }

  public async sendNotifyNewsLetter(subscribers: Subscriber[], posts: PostWithUserIdRdo[]): Promise<void> {
    const { apiBlogPostUrl, mailSmtp: { from } } = this.notifyConfig;
    const urls = posts.map(({ id }) => ({ title: id, url: `${apiBlogPostUrl}/${id}` }));

    for (const subscriber of subscribers) {
      const { name, email } = subscriber;
      const sendMailOption: ISendMailOptions = {
        from,
        to: email,
        subject: NEWS_LETTER_SUBJECT,
        template: NEWS_LETTER_TEMPLATE,
        context: { name, urls }
      };

      await this.mailerService.sendMail(sendMailOption);
    }
  }
}
