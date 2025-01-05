import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostRdo } from './post.rdo';
import { EntityApiProperty } from '../blog-post-entity.constant.property';

export class PostWithPaginationRdo {
  @ApiProperty(EntityApiProperty.Entities)
  @Expose()
  public entities: PostRdo[];

  @ApiProperty(EntityApiProperty.TotalPages)
  @Expose()
  public totalPages: number;

  @ApiProperty(EntityApiProperty.TotalItems)
  @Expose()
  public totalItems: number;

  @ApiProperty(EntityApiProperty.CurrentPage)
  @Expose()
  public currentPage: number;

  @ApiProperty(EntityApiProperty.ItemsPerPage)
  @Expose()
  public itemsPerPage: number;
}
