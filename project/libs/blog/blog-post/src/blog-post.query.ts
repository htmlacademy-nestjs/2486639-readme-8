import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { PostType, SortType } from '@project/shared/core';

import { Default, PostValidation } from './blog-post.constant';

export class BlogPostQuery {
  //! добавить сообщение и проверку на MongoId
  @IsString()
  @IsOptional()
  public userId?: string;

  //! добавить сообщение
  @IsEnum(SortType)
  @IsOptional()
  public sortType: SortType = Default.SORT_TYPE;

  //! добавить сообщение
  @IsEnum(PostType)
  @IsOptional()
  public type?: PostType;

  //! добавить сообщение
  //!  не пускает ?isDraft=true -> "isDraft must be a boolean value"
  @IsBoolean()
  @IsOptional()
  public isDraft?: boolean;

  //! добавить сообщение
  @IsString()
  @Matches(PostValidation.Tags.RegExp)
  @MinLength(PostValidation.Tags.MinLength)
  @MaxLength(PostValidation.Tags.MaxLength)
  @IsOptional()
  public tag?: string;

  //! добавить сообщение
  @IsInt()
  @Transform(({ value }) => +value || Default.PAGE_COUNT)
  @IsOptional()
  public page: number = Default.PAGE_COUNT;
}
