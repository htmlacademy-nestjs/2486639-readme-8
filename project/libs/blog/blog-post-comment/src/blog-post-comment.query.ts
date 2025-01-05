import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { PageQueryApiProperty } from '@project/shared/core';

import { DEFAULT_CURRENT_PAGE } from './blog-post-comment.constant';

export class BlogPostCommentQuery {
  @ApiProperty(PageQueryApiProperty)
  @IsInt()
  @Transform(({ value }) => +value || DEFAULT_CURRENT_PAGE)
  @IsOptional()
  public page: number = DEFAULT_CURRENT_PAGE;
}
