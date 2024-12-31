import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

import { PostState, PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';

export class UpdatePostDto {
  @ApiProperty(PostApiProperty.Type)
  @IsOptional()
  @IsString()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiProperty(PostApiProperty.State)
  @IsOptional()
  @IsString()
  @IsEnum(PostState)
  public state?: PostState;

  @ApiProperty(PostApiProperty.PublishDate)
  @IsOptional()
  @IsDateString()
  public publishDate?: Date;

  @ApiProperty(PostApiProperty.Tags)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];

  @ApiProperty(PostApiProperty.Title)
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiProperty(PostApiProperty.Url)
  @IsOptional()
  @IsString()
  public url?: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @IsOptional()
  @IsString()
  public previewText?: string;

  @ApiProperty(PostApiProperty.Text)
  @IsOptional()
  @IsString()
  public text?: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @IsOptional()
  @IsString()
  public quoteText?: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @IsOptional()
  @IsString()
  public quoteAuthor?: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @IsOptional()
  @IsString()
  public imagePath?: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @IsOptional()
  @IsString()
  public linkDescription?: string;
}
