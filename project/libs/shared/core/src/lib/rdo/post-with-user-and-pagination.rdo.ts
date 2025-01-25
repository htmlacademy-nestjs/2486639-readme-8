import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserRdo } from './post-with-user.rdo';
import { PaginationApiProperty } from '../constants/pagination-api-property';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostWithUserAndPaginationRdo {
  @ApiProperty({
    ...ApiPropertyOption.Post.Entities,
    type: PostWithUserRdo
  })
  @Type(() => PostWithUserRdo)
  @Expose()
  public entities: PostWithUserRdo[];

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
