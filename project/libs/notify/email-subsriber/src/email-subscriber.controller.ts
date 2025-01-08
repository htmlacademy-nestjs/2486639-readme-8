import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { ConfigAlias, RabbitRouting } from '@project/shared/core';
import { MailService } from '@project/notify/mail';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService
  ) { }

  @RabbitSubscribe({
    exchange: process.env[ConfigAlias.RabbitExchangeEnv], //! 'readme.notify', а как забрать через config module?
    queue: process.env[ConfigAlias.RabbitQueueEnv], //! 'readme.notify.income', а как забрать через config module?
    routingKey: RabbitRouting.AddSubscriber
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }
}
