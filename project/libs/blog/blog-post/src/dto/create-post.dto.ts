import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';
import { PostValidateMessage, PostValidation } from '../blog-post.constant';

export class CreatePostDto {
  @ApiProperty(PostApiProperty.Type)
  @IsString()
  @IsEnum(PostType, PostValidateMessage.Type)
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @IsArray()
  @IsString({ each: true })
  public tags: string[];

  @ApiProperty(PostApiProperty.Title)
  @IsOptional()
  @IsString()
  @MinLength(PostValidation.Title.MinLength, PostValidateMessage.Title.MinLength)
  @MaxLength(PostValidation.Title.MaxLength, PostValidateMessage.Title.MaxLength)
  public title: string;

  @ApiProperty(PostApiProperty.Url)
  @IsOptional()
  @IsString()
  public url: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @IsOptional()
  @IsString()
  public previewText: string;

  @ApiProperty(PostApiProperty.Text)
  @IsOptional()
  @IsString()
  public text: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @IsOptional()
  @IsString()
  public quoteText: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @IsOptional()
  @IsString()
  public quoteAuthor: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @IsOptional()
  @IsString()
  public imagePath: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @IsOptional()
  @IsString()
  public linkDescription: string;
}
