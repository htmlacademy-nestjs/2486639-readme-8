//!import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

//! добавить описание
//import { PostApiProperty } from '../blog-post.constant.property';

/*  SubscriptionsCount: {
    description: 'The user subscriptions count',
    example: 5
  } */
export class UserSubscriptionsCountRdo {
  //@ApiProperty(PostApiProperty.UserId)
  @Expose()
  public userId: string;

  //@ApiProperty(PostApiProperty.SubscriptionsCount)
  @Expose()
  public subscriptionsCount: number;
}
