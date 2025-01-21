import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { PostApiProperty } from '../blog-post.constant.property';
import { BaseBlogPostQuery } from './base-blog-post.query';

export class SearchBlogPostQuery extends BaseBlogPostQuery {
  @ApiProperty({ ...PostApiProperty.UserId, required: false })
  @IsString()
  @IsOptional()
  @IsMongoId()
  public userId?: string;
}
