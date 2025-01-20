import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SubscriptionApiProperty } from '../blog-subscription.constant.property';

export class UserSubscriptionsCountRdo {
  @ApiProperty(SubscriptionApiProperty.UserId)
  @Expose()
  public userId: string;

  @ApiProperty(SubscriptionApiProperty.SubscriptionsCount)
  @Expose()
  public subscriptionsCount: number;
}
