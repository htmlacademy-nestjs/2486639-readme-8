import { Controller } from '@nestjs/common';
import { RabbitHeader, RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { ConfigAlias, PostWithUserIdRdo, RabbitRouting, XHeader } from '@project/shared/core';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService
  ) { }

  @RabbitSubscribe({
    exchange: process.env[ConfigAlias.RabbitExchangeEnv], // а как забрать через config module?
    queue: process.env[ConfigAlias.RabbitQueueSubscriberEnv], // а как забрать через config module?
    routingKey: RabbitRouting.AddSubscriber
  })
  public async create(@RabbitHeader(XHeader.RequestId) requestId: string, @RabbitPayload() subscriber: CreateSubscriberDto): Promise<void> {
    await this.subscriberService.addSubscriber(subscriber, requestId);
  }

  @RabbitSubscribe({
    exchange: process.env[ConfigAlias.RabbitExchangeEnv], // а как забрать через config module?
    queue: process.env[ConfigAlias.RabbitQueueNewsLetterEnv], // а как забрать через config module?
    routingKey: RabbitRouting.AddNewsLetter
  })
  public async sendAll(posts: PostWithUserIdRdo[]): Promise<void> {
    await this.subscriberService.sendAll(posts);
  }
}
