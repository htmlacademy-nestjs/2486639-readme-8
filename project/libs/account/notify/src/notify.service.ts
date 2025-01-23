import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting, XHeader } from '@project/shared/core';
import { rabbitConfig } from '@project/account/config';
import { CreateSubscriberDto } from '@project/notify/email-subsriber';

@Injectable()
export class NotifyService {
  @Inject(rabbitConfig.KEY)
  private readonly rabbitOptions: ConfigType<typeof rabbitConfig>;

  constructor(
    private readonly rabbitClient: AmqpConnection
  ) { }

  public async registerSubscriber(dto: CreateSubscriberDto, requestId: string) {
    const result = await this.rabbitClient.publish<CreateSubscriberDto>(
      this.rabbitOptions.exchange,
      RabbitRouting.AddSubscriber,
      dto,
      { headers: { [XHeader.RequestId]: requestId } }
    );

    return result;
  }
}
