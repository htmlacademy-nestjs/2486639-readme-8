import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { DetailPostRdo } from './detail-post.rdo';
import { UserRdo } from './user.rdo';

export class DetailPostWithUserRdo extends DetailPostRdo {
  @ApiProperty({ type: UserRdo })
  @Type(() => UserRdo)
  @Expose()
  public user: UserRdo;
}
