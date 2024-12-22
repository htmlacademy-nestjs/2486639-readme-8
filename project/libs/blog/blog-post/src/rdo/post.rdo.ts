import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostData, PostType } from '@project/shared/core';

//import { AuthenticationApiProperty } from '../authentication.constant.property';

export class PostRdo {
  //@ApiProperty(AuthenticationApiProperty.User.Id)
  @ApiProperty({ description: 'asdsads' })
  @Expose()
  public id: string;

  @Expose()
  public type: PostType;

  @Expose()
  public tags: string[];

  @Expose()
  public data: PostData;
}
