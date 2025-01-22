import { Injectable, Logger } from '@nestjs/common';

import { MailService } from '@project/notify/mail';
import { PostRdo } from '@project/blog/blog-post';

import { EmailSubscriberEntity } from './email-subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  private readonly logContext = '[EmailSubscriberService.addSubscriber]';

  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService
  ) { }

  public async addSubscriber(subscriber: CreateSubscriberDto): Promise<void> {
    const { email, requestId } = subscriber;

    Logger.log(`RequestId: ${requestId}`, this.logContext);

    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      Logger.log('Subscriber exists', this.logContext);

      return;
    }

    const emailSubscriber = new EmailSubscriberEntity(subscriber);

    await this.emailSubscriberRepository.save(emailSubscriber);
    Logger.log('New subscriber saved', this.logContext);

    await this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  public async sendAll(posts: PostRdo[]): Promise<void> {
    const documents = await this.emailSubscriberRepository.findAll();

    if (!documents.length) {
      return
    }

    const recipients = documents.map((document) => (document.email));

    //!
    console.log('recipients', recipients);
    console.log('posts', posts);

    await this.mailService.sendNotifyNewsLetter(recipients, posts);
  }
}
