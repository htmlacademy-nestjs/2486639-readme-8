import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PostRdo } from './post.rdo';
import { UserRdo } from './user.rdo';

export class PostWithUserRdo extends PostRdo {
  @ApiProperty({ type: UserRdo })
  @Type(() => UserRdo)
  @Expose()
  public user: UserRdo;
}
