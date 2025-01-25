import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostRdo } from './post.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostWithUserIdRdo extends PostRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;
}
