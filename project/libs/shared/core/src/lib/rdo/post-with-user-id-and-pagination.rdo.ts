import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserIdRdo } from './post-with-user-id.rdo';
import { PaginationRdo } from './pagination.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostWithUserIdAndPaginationRdo extends PaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Post.Entities,
    type: PostWithUserIdRdo
  })
  @Type(() => PostWithUserIdRdo)
  @Expose()
  public entities: PostWithUserIdRdo[];
}
