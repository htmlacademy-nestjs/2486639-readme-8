import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { PostType, SortType } from '@project/shared/core';

import { Default, PostValidation } from '../blog-post.constant';
import { PostApiProperty, PostQueryApiProperty } from '../blog-post.constant.property';
import { PageQuery } from './page.query';

export class BaseBlogPostQuery extends PageQuery {
  @ApiProperty(PostQueryApiProperty.SortType)
  @IsEnum(SortType)
  @IsOptional()
  public sortType?: SortType = Default.SORT_TYPE;

  @ApiProperty({ ...PostApiProperty.Type, required: false })
  @IsEnum(PostType)
  @IsOptional()
  public type?: PostType;

  @ApiProperty(PostQueryApiProperty.Tag)
  @IsString()
  @Matches(PostValidation.Tags.TagRegexp)
  @MinLength(PostValidation.Tags.TagMinLength)
  @MaxLength(PostValidation.Tags.TagMaxLength)
  @IsOptional()
  public tag?: string;
}
