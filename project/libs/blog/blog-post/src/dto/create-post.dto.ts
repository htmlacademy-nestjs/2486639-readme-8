import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';

export class CreatePostDto {
  @ApiProperty(PostApiProperty.Type)
  @IsString()
  @IsEnum(PostType)
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @IsArray()
  @IsString({ each: true })
  public tags: string[];

  @ApiProperty(PostApiProperty.Title)
  @IsString()
  public title: string;

  @ApiProperty(PostApiProperty.Url)
  @IsString()
  public url: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @IsString()
  public previewText: string;

  @ApiProperty(PostApiProperty.Text)
  @IsString()
  public text: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @IsString()
  public quoteText: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @IsString()
  public quoteAuthor: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @IsString()
  public imagePath: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @IsString()
  public linkDescription: string;
}
