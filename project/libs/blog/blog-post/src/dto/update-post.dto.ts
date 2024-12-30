import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PostState, PostType, Tag } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';

export class UpdatePostDto {
  @ApiProperty(PostApiProperty.Type)
  @IsOptional()
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @IsOptional()
  public tags: Tag[];

  public publishDate: Date;
  public state: PostState;
  public url: string;
  public previewText: string;
  public text: string;
  public quoteText: string;
  public quoteAuthor: string;
  public imagePath: string;
  public linkDescription: string;

  //! использовать новые свойства
  /*
  @ApiProperty(PostApiProperty.Data)
  @IsOptional()
  public data: PostData;
  */
}
