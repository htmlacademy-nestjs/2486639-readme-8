import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class DetailUserRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.User.registrationDate)
  @Expose()
  public registrationDate: string;

  @ApiProperty(ApiPropertyOption.Post.PostsCount)
  @Expose()
  public postsCount: number;

  @ApiProperty(ApiPropertyOption.Post.SubscriptionsCount)
  @Expose()
  public subscriptionsCount: number;
}
