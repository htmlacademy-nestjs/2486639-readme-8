import { Injectable, Logger } from '@nestjs/common';

import { EmailSubscriberEntity } from './email-subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  private readonly logContext = '[EmailSubscriberService.addSubscriber]';

  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) { }

  public async addSubscriber(subscriber: CreateSubscriberDto): Promise<EmailSubscriberEntity> {
    const { email, requestId } = subscriber;

    Logger.log(`RequestId: ${requestId}`, this.logContext);

    const existsSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existsSubscriber) {
      Logger.log('Subscriber exists', this.logContext);

      return existsSubscriber;
    }

    const emailSubscriber = new EmailSubscriberEntity(subscriber);

    await this.emailSubscriberRepository.save(emailSubscriber);
    Logger.log('New subscriber saved', this.logContext);

    return emailSubscriber;
  }
}
