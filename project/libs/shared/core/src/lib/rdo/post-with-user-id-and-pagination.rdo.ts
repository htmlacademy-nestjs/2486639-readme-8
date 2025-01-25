import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserIdRdo } from './post-with-user-id.rdo';
import { PaginationApiProperty } from '../constants/pagination-api-property';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostWithUserIdAndPaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Post.Entities,
    type: PostWithUserIdRdo
  })
  @Type(() => PostWithUserIdRdo)
  @Expose()
  public entities: PostWithUserIdRdo[];

  @ApiProperty(PaginationApiProperty.TotalPages)
  @Expose()
  public totalPages: number;

  @ApiProperty(PaginationApiProperty.TotalItems)
  @Expose()
  public totalItems: number;

  @ApiProperty(PaginationApiProperty.CurrentPage)
  @Expose()
  public currentPage: number;

  @ApiProperty(PaginationApiProperty.ItemsPerPage)
  @Expose()
  public itemsPerPage: number;
}
