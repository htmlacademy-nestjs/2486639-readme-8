import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting } from '@project/shared/core';
import { blogConfig } from '@project/blog/config';
import { PostRdo } from '@project/blog/blog-post';

@Injectable()
export class NotifyService {
  @Inject(blogConfig.KEY)
  private readonly blogOptions: ConfigType<typeof blogConfig>;

  constructor(
    private readonly rabbitClient: AmqpConnection
  ) { }

  public async registerNewLetter(posts: PostRdo[]) {
    const result = await this.rabbitClient.publish<PostRdo[]>(
      this.blogOptions.rabbit.exchange,
      RabbitRouting.AddNewsLetter,
      posts,
      { headers: { aaa: 'dddd' } }//!X-Request-ID передать, если есть, проверить!
    );

    return result;
  }
}
