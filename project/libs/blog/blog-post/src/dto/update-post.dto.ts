import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { ApiPropertyOption, DateFormat, PostState, PostType } from '@project/shared/core';

import { PostValidation } from '../blog-post.constant';

export class UpdatePostDto {
  @ApiProperty({
    ...ApiPropertyOption.Post.Type,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiProperty({
    description: ApiPropertyOption.Post.Tags.description + ' - warning! not correct send string[]!',
    name: 'tags[0]', // не корректная передача string[] через form-data
    required: false,
    example: ['tag1']
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
    ...ApiPropertyOption.Post.State,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostState)
  public state?: PostState;

  @ApiProperty({
    ...ApiPropertyOption.Post.PublishDate,
    required: false
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @Transform(({ value }) => dayjs(value).format(DateFormat.ONLY_DATE))
  public publishDate?: string;

  @ApiProperty(ApiPropertyOption.Post.Title)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Title.MinLength)
  @MaxLength(PostValidation.Title.MaxLength)
  public title?: string;

  @ApiProperty(ApiPropertyOption.Post.Url)
  @IsOptional()
  @IsString()
  @IsUrl()  // по умолчанию require_tld - true и не пропускает localhost, а require_tld - false пропускает любые строки
  public url?: string;

  @ApiProperty({ ...ApiPropertyOption.Post.PreviewText, example: '' })
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.PreviewText.MinLength)
  @MaxLength(PostValidation.PreviewText.MaxLength)
  public previewText?: string;

  @ApiProperty({ ...ApiPropertyOption.Post.Text, example: '' })
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Text.MinLength)
  @MaxLength(PostValidation.Text.MaxLength)
  public text?: string;

  @ApiProperty({ ...ApiPropertyOption.Post.QuoteText, example: '' })
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteText.MinLength)
  @MaxLength(PostValidation.QuoteText.MaxLength)
  public quoteText?: string;

  @ApiProperty({ ...ApiPropertyOption.Post.QuoteAuthor, example: '' })
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteAuthor.MinLength)
  @MaxLength(PostValidation.QuoteAuthor.MaxLength)
  public quoteAuthor?: string;

  @ApiProperty(ApiPropertyOption.Post.ImageFile)
  @IsOptional()
  @IsString()
  public imageFile?: string;

  @ApiProperty({ ...ApiPropertyOption.Post.LinkDescription, example: '' })
  @IsOptional()
  @IsString()
  @MaxLength(PostValidation.LinkDescription.MaxLength)
  public linkDescription?: string;
}
