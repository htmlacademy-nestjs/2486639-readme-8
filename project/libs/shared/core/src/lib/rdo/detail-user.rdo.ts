import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserRdo } from './user.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class DetailUserRdo extends UserRdo {
  @ApiProperty(ApiPropertyOption.Post.PostsCount)
  @Expose()
  public postsCount: number;

  @ApiProperty(ApiPropertyOption.Post.SubscriptionsCount)
  @Expose()
  public subscriptionsCount: number;
}
