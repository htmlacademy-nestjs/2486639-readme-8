import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PaginationApiProperty } from '../constants/pagination-api-property';

export class PaginationRdo {
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
