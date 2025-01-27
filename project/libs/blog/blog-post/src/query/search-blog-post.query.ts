import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOption } from '@project/shared/core';

import { BaseBlogPostQuery } from './base-blog-post.query';

export class SearchBlogPostQuery extends BaseBlogPostQuery {
  @ApiProperty({ ...ApiPropertyOption.User.Id, required: false })
  @IsString()
  @IsOptional()
  @IsMongoId()
  public userId?: string;
}
