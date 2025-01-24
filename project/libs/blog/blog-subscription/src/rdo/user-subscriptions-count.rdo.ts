import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class UserSubscriptionsCountRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;

  @ApiProperty(ApiPropertyOption.Post.SubscriptionsCount)
  @Expose()
  public subscriptionsCount: number;
}
