import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

import { PostState, PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';
import { PostValidateMessage, PostValidation } from '../blog-post.constant';

export class UpdatePostDto {
  @ApiProperty({
    ...PostApiProperty.Type,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostType, PostValidateMessage.Type)
  public type?: PostType;

  @ApiProperty({
    ...PostApiProperty.Tags,
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(PostValidation.Tags.MaxCount)
  @IsString({ each: true })
  @Matches(PostValidation.Tags.RegExp, { each: true })
  @MinLength(PostValidation.Tags.MinLength, PostValidateMessage.Tags.MinLength)
  @MaxLength(PostValidation.Tags.MaxLength, PostValidateMessage.Tags.MaxLength)
  public tags?: string[];

  @ApiProperty({
    ...PostApiProperty.State,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostState, PostValidateMessage.State)
  public state?: PostState;

  @ApiProperty({
    ...PostApiProperty.PublishDate,
    required: false
  })
  @IsOptional()
  @IsDateString() //! проверить нужен ли дополнительный формат - 2024-07-09T11:24:14.495Z
  public publishDate?: Date;

  @ApiProperty(PostApiProperty.Title)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Title.MinLength, PostValidateMessage.Title.MinLength)
  @MaxLength(PostValidation.Title.MaxLength, PostValidateMessage.Title.MaxLength)
  public title?: string;

  @ApiProperty(PostApiProperty.Url)
  @IsOptional()
  @IsString()
  //@IsUrl({ 'require_tld': false }, PostValidateMessage.Url) //! пропускает любые строки
  @IsUrl({}, PostValidateMessage.Url) //! не пропускает localhost
  public url?: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.PreviewText.MinLength, PostValidateMessage.PreviewText.MinLength)
  @MaxLength(PostValidation.PreviewText.MaxLength, PostValidateMessage.PreviewText.MaxLength)
  public previewText?: string;

  @ApiProperty(PostApiProperty.Text)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Text.MinLength, PostValidateMessage.Text.MinLength)
  @MaxLength(PostValidation.Text.MaxLength, PostValidateMessage.Text.MaxLength)
  public text?: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteText.MinLength, PostValidateMessage.QuoteText.MinLength)
  @MaxLength(PostValidation.QuoteText.MaxLength, PostValidateMessage.QuoteText.MaxLength)
  public quoteText?: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.QuoteAuthor.MinLength, PostValidateMessage.QuoteAuthor.MinLength)
  @MaxLength(PostValidation.QuoteAuthor.MaxLength, PostValidateMessage.QuoteAuthor.MaxLength)
  public quoteAuthor?: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @IsOptional()
  @IsString()
  public imagePath?: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @IsOptional()
  @IsString()
  @MaxLength(PostValidation.LinkDescription.MaxLength, PostValidateMessage.LinkDescription.MaxLength)
  public linkDescription?: string;
}
