import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginationApiProperty } from '@project/shared/core';

import { PostCommentRdo } from './post-comment.rdo';
import { EntityApiProperty } from '../blog-post-comment-entity.constant.property';

export class PostCommentWithPaginationRdo {
  @ApiProperty(EntityApiProperty.Entities)
  @Type(() => PostCommentRdo)
  @Expose()
  public entities: PostCommentRdo[];

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

