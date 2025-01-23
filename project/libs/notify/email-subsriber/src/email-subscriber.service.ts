import { Injectable, Logger } from '@nestjs/common';

import { MailService } from '@project/notify/mail';
import { PostRdo } from '@project/blog/blog-post';

import { EmailSubscriberEntity } from './email-subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService
  ) { }

  public async addSubscriber(subscriber: CreateSubscriberDto): Promise<void> {
    const loggerContext = '[EmailSubscriberService.addSubscriber';
    const { email } = subscriber;
    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      Logger.log('Subscriber exists', loggerContext);

      return;
    }

    const emailSubscriber = new EmailSubscriberEntity(subscriber);

    await this.emailSubscriberRepository.save(emailSubscriber);
    Logger.log('New subscriber saved', loggerContext);

    await this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  public async sendAll(posts: PostRdo[]): Promise<void> {
    const subscribers = await this.emailSubscriberRepository.findAll();

    Logger.log(`Subscribers count: ${subscribers.length}`, '[EmailSubscriberService.sendAll');

    if (!subscribers.length) {
      return
    }

    await this.mailService.sendNotifyNewsLetter(subscribers, posts);
  }
}
