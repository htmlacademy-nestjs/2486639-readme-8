import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { PageQueryApiProperty } from '@project/shared/core';

import { Default } from './blog-post-comment.constant';

export class BlogPostCommentQuery {
  @ApiProperty(PageQueryApiProperty)
  @IsInt()
  @Transform(({ value }) => +value || Default.CURRENT_PAGE)
  @IsOptional()
  public page: number = Default.CURRENT_PAGE;
}
