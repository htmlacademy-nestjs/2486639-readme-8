import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserRdo } from './post-with-user.rdo';
import { PaginationRdo } from './pagination.rdo';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostWithUserAndPaginationRdo extends PaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Post.Entities,
    type: PostWithUserRdo
  })
  @Type(() => PostWithUserRdo)
  @Expose()
  public entities: PostWithUserRdo[];
}
