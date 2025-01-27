import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { CommentRdo } from './comment.rdo';
import { UserRdo } from './user.rdo';

export class CommentWithUserRdo extends CommentRdo {
  @ApiProperty({ type: UserRdo })
  @Type(() => UserRdo)
  @Expose()
  public user: string;
}
