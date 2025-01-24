import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class DetailUserRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;

  // @ApiProperty(ApiPropertyOption.User.registrationDate) //!
  @Expose()
  public registrationDate: string;

  // @ApiProperty(PostApiProperty.PostsCount)//!
  @ApiProperty({
    description: 'The user posts count',
    example: 5
  })
  @Expose()
  public postsCount: number;

  @ApiProperty({
    description: 'The user subscriptions count',
    example: 5
  })
  @Expose()
  public subscriptionsCount: number;
}
