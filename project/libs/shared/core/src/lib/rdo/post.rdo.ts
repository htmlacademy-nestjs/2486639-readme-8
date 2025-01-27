import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { PostType } from '../types/post-type.enum';
import { transformDate, transformTags } from '../utils/transform';
import { ApiPropertyOption } from '../constants/api-property-option';

export class PostRdo {
  @ApiProperty(ApiPropertyOption.Post.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.Post.Type)
  @Expose()
  public type: PostType;

  @ApiProperty(ApiPropertyOption.Post.Tags)
  @Expose()
  @Transform(transformTags)
  public tags: string[];

  @ApiProperty(ApiPropertyOption.Post.PublishDate)
  @Transform(transformDate)
  @Expose()
  public publishDate: string;

  @ApiProperty(ApiPropertyOption.Post.Title)
  @Expose()
  public title: string;

  @ApiProperty(ApiPropertyOption.Post.Url)
  @Expose()
  public url: string;

  @ApiProperty(ApiPropertyOption.Post.PreviewText)
  @Expose()
  public previewText: string;

  @ApiProperty(ApiPropertyOption.Post.Text)
  @Expose()
  public text: string;

  @ApiProperty(ApiPropertyOption.Post.QuoteText)
  @Expose()
  public quoteText: string;

  @ApiProperty(ApiPropertyOption.Post.QuoteAuthor)
  @Expose()
  public quoteAuthor: string;

  @ApiProperty(ApiPropertyOption.Post.ImagePath)
  @Expose()
  public imagePath: string;

  @ApiProperty(ApiPropertyOption.Post.LinkDescription)
  @Expose()
  public linkDescription: string;

  @ApiProperty(ApiPropertyOption.Post.LikesCount)
  @Expose()
  public likesCount: number;

  @ApiProperty(ApiPropertyOption.Post.CommentsCount)
  @Expose()
  public commentsCount: number;
}
