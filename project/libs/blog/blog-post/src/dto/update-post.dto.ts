import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { PostState, PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';
import { ONLY_DATE_FORMAT, PostValidation } from '../blog-post.constant';

export class UpdatePostDto {
  @ApiProperty({
    ...PostApiProperty.Type,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiProperty({
    ...PostApiProperty.Tags,
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(PostValidation.Tags.MaxCount)
  @IsString({ each: true })
  @Matches(PostValidation.Tags.TagRegexp, { each: true })
  @MinLength(PostValidation.Tags.TagMinLength, { each: true })
  @MaxLength(PostValidation.Tags.TagMaxLength, { each: true })
  public tags?: string[];

  @ApiProperty({
    ...PostApiProperty.State,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostState)
  public state?: PostState;

  @ApiProperty({
    ...PostApiProperty.PublishDate,
    required: false
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @Transform(({ value }) => dayjs(value).format(ONLY_DATE_FORMAT))
  public publishDate?: string;

  @ApiProperty(PostApiProperty.Title)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Title.MinLength)
  @MaxLength(PostValidation.Title.MaxLength)
  public title?: string;

  @ApiProperty(PostApiProperty.Url)
  @IsOptional()
  @IsString()
  //@IsUrl({ 'require_tld': false }) //! пропускает любые строки
  @IsUrl() //! не пропускает localhost
  public url?: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.PreviewText.MinLength)
  @MaxLength(PostValidation.PreviewText.MaxLength)
  public previewText?: string;

  @ApiProperty(PostApiProperty.Text)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Text.MinLength)
  @MaxLength(PostValidation.Text.MaxLength)
  public text?: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteText.MinLength)
  @MaxLength(PostValidation.QuoteText.MaxLength)
  public quoteText?: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteAuthor.MinLength)
  @MaxLength(PostValidation.QuoteAuthor.MaxLength)
  public quoteAuthor?: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @IsOptional()
  @IsString()
  public imagePath?: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @IsOptional()
  @IsString()
  @MaxLength(PostValidation.LinkDescription.MaxLength)
  public linkDescription?: string;
}
