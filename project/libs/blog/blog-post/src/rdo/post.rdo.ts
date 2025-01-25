import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { ApiPropertyOption, DateFormat, PostType } from '@project/shared/core';

export class PostRdo {
  @ApiProperty(ApiPropertyOption.Post.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.Post.Type)
  @Expose()
  public type: PostType;

  @ApiProperty(ApiPropertyOption.Post.Tags)
  @Expose()
  @Transform(({ value }) => value.map((item: { title: string; }) => item.title))
  public tags: string[];

  @ApiProperty(ApiPropertyOption.Post.PublishDate)
  @Transform(({ value }) => dayjs(value).format(DateFormat.ONLY_DATE))
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

  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;

  @ApiProperty(ApiPropertyOption.Post.LikesCount)
  @Expose()
  public likesCount: number;

  @ApiProperty(ApiPropertyOption.Post.CommentsCount)
  @Expose()
  public commentsCount: number;
}
