import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CommentRdo } from './comment.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class CommentWithUserIdRdo extends CommentRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;
}
