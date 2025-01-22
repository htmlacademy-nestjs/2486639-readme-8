import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting } from '@project/shared/core';

import { blogConfig } from '@project/blog/config';

@Injectable()
export class NotifyService {
  @Inject(blogConfig.KEY)
  private readonly blogOptions: ConfigType<typeof blogConfig>;

  constructor(
    private readonly rabbitClient: AmqpConnection
  ) { }

  //!
  public async registerNewLetter(dto: any) {
    const result = await this.rabbitClient.publish<any>(
      this.blogOptions.rabbit.exchange,
      RabbitRouting.AddNewsLetter,
      { ...dto }
    );

    return result;
  }
}
