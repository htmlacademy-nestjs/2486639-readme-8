//! import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PostWithUserRdo } from './post-with-user.rdo';

export class PostWithUserAndPaginationRdo {
  //! @ApiProperty(EntityApiProperty.Entities)
  @Type(() => PostWithUserRdo)
  @Expose()
  public entities: PostWithUserRdo[];

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
