import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { CommentWithUserIdRdo } from './comment-with-user-id.rdo';
import { PaginationRdo } from './pagination.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class CommentWithUserIdAndPaginationRdo extends PaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Post.Entities,
    type: CommentWithUserIdRdo
  })
  @Type(() => CommentWithUserIdRdo)
  @Expose()
  public entities: CommentWithUserIdRdo[];
}
