import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { PostType, SortType } from '@project/shared/core';

import { Default, PostValidation } from './blog-post.constant';
import { PostApiProperty, PostQueryApiProperty } from './blog-post.constant.property';

export class BlogPostQuery {
  //! добавить проверку на MongoId
  @ApiProperty({ ...PostApiProperty.UserId, required: false })
  @IsString()
  @IsOptional()
  public userId?: string;

  @ApiProperty(PostQueryApiProperty.SortType)
  @IsEnum(SortType)
  @IsOptional()
  public sortType: SortType = Default.SORT_TYPE;

  @ApiProperty({ ...PostApiProperty.Type, required: false })
  @IsEnum(PostType)
  @IsOptional()
  public type?: PostType;

  @ApiProperty(PostQueryApiProperty.ShowDraft)
  @Transform(({ obj }) => (obj.showDraft === 'true'))
  @IsOptional()
  public showDraft = false;

  @ApiProperty(PostQueryApiProperty.Tag)
  @IsString()
  @Matches(PostValidation.Tags.RegExp)
  @MinLength(PostValidation.Tags.MinLength)
  @MaxLength(PostValidation.Tags.MaxLength)
  @IsOptional()
  public tag?: string;

  @ApiProperty(PostQueryApiProperty.Page)
  @IsInt()
  @Transform(({ value }) => +value || Default.CURRENT_PAGE)
  @IsOptional()
  public page: number = Default.CURRENT_PAGE;
}
