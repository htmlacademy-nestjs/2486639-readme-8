import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { CommentWithUserRdo } from './comment-with-user.rdo';
import { PaginationRdo } from './pagination.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class CommentWithUserAndPaginationRdo extends PaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Comment.Entities,
    type: CommentWithUserRdo
  })
  @Type(() => CommentWithUserRdo)
  @Expose()
  public entities: CommentWithUserRdo[];
}
