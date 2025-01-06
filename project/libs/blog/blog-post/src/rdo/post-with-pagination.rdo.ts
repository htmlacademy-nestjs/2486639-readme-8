import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginationApiProperty } from '@project/shared/core';

import { PostRdo } from './post.rdo';
import { EntityApiProperty } from '../blog-post-entity.constant.property';

export class PostWithPaginationRdo {
  @ApiProperty(EntityApiProperty.Entities)
  @Type(() => PostRdo)
  @Expose()
  public entities: PostRdo[];

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
