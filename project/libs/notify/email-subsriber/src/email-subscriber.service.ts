import { Injectable, Logger } from '@nestjs/common';

import { PostWithUserIdRdo, XHeader } from '@project/shared/core';
import { MailService } from '@project/notify/mail';

import { EmailSubscriberEntity } from './email-subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService
  ) { }

  public async addSubscriber(subscriber: CreateSubscriberDto, requestId: string): Promise<void> {
    Logger.log(`AddSubscriber: ${XHeader.RequestId}: ${requestId || 'empty'}`, EmailSubscriberService.name);

    const { email } = subscriber;
    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      Logger.log('AddSubscriber: subscriber exists', EmailSubscriberService.name);

      return;
    }

    const emailSubscriber = new EmailSubscriberEntity(subscriber);

    await this.emailSubscriberRepository.save(emailSubscriber);
    Logger.log(`AddSubscriber: new subscriber ${email} saved`, EmailSubscriberService.name);

    await this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  public async sendAll(posts: PostWithUserIdRdo[]): Promise<void> {
    const subscribers = await this.emailSubscriberRepository.findAll();

    Logger.log(`SendAll: subscribers count: ${subscribers.length}`, EmailSubscriberService.name);

    if (!subscribers.length) {
      return
    }

    await this.mailService.sendNotifyNewsLetter(subscribers, posts);
  }
}
