import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { userIdApiParam } from '../blog-subscription.constant';

export class UserSubscriptionsCountRdo {
  @ApiProperty(userIdApiParam.schema)
  @Expose()
  public userId: string;

  @ApiProperty({
    description: 'The user subscriptions count',
    example: 5
  })
  @Expose()
  public subscriptionsCount: number;
}
