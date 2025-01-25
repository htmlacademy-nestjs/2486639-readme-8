//! import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserIdRdo } from './post-with-user-id.rdo';

export class PostWithUserIdAndPaginationRdo {
  //! @ApiProperty(EntityApiProperty.Entities)
  @Type(() => PostWithUserIdRdo)
  @Expose()
  public entities: PostWithUserIdRdo[];

  //! @ApiProperty(PaginationApiProperty.TotalPages)
  @Expose()
  public totalPages: number;

  //! @ApiProperty(PaginationApiProperty.TotalItems)
  @Expose()
  public totalItems: number;

  //! @ApiProperty(PaginationApiProperty.CurrentPage)
  @Expose()
  public currentPage: number;

  //! @ApiProperty(PaginationApiProperty.ItemsPerPage)
  @Expose()
  public itemsPerPage: number;
}
