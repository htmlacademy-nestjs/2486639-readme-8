import { Controller, UseInterceptors } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { ConfigAlias, RabbitRouting } from '@project/shared/core';
import { InjectRequestIdInterceptor } from '@project/shared/interceptors';
import { PostRdo } from '@project/blog/blog-post';

import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService
  ) { }

  @UseInterceptors(InjectRequestIdInterceptor)
  @RabbitSubscribe({
    exchange: process.env[ConfigAlias.RabbitExchangeEnv], // а как забрать через config module?
    queue: process.env[ConfigAlias.RabbitQueueEnv], // а как забрать через config module?
    routingKey: RabbitRouting.AddSubscriber
  })
  public async create(subscriber: CreateSubscriberDto): Promise<void> {
    await this.subscriberService.addSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: process.env[ConfigAlias.RabbitExchangeEnv], // а как забрать через config module?
    queue: process.env[ConfigAlias.RabbitQueueEnv], // а как забрать через config module?
    routingKey: RabbitRouting.AddNewsLetter
  })
  public async sendAll(posts: PostRdo[]): Promise<void> {
    await this.subscriberService.sendAll(posts);
  }
}
