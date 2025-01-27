import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { PostWithUserIdRdo, RabbitRouting } from '@project/shared/core';
import { blogConfig } from '@project/blog/config';

@Injectable()
export class NotifyService {
  @Inject(blogConfig.KEY)
  private readonly blogOptions: ConfigType<typeof blogConfig>;

  constructor(
    private readonly rabbitClient: AmqpConnection
  ) { }

  public async registerNewLetter(posts: PostWithUserIdRdo[]) {
    const result = await this.rabbitClient.publish<PostWithUserIdRdo[]>(
      this.blogOptions.rabbit.exchange,
      RabbitRouting.AddNewsLetter,
      posts
    );

    return result;
  }
}
