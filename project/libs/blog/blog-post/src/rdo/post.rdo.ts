import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { ApiPropertyOption, PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';
import { ONLY_DATE_FORMAT } from '../blog-post.constant';

export class PostRdo {
  @ApiProperty(PostApiProperty.Id)
  @Expose()
  public id: string;

  @ApiProperty(PostApiProperty.Type)
  @Expose()
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @Expose()
  @Transform(({ value }) => value.map((item: { title: string; }) => item.title))
  public tags: string[];

  @ApiProperty(PostApiProperty.PublishDate)
  @Transform(({ value }) => dayjs(value).format(ONLY_DATE_FORMAT))
  @Expose()
  public publishDate: string;

  @ApiProperty(PostApiProperty.Title)
  @Expose()
  public title: string;

  @ApiProperty(PostApiProperty.Url)
  @Expose()
  public url: string;

  @ApiProperty(PostApiProperty.PreviewText)
  @Expose()
  public previewText: string;

  @ApiProperty(PostApiProperty.Text)
  @Expose()
  public text: string;

  @ApiProperty(PostApiProperty.QuoteText)
  @Expose()
  public quoteText: string;

  @ApiProperty(PostApiProperty.QuoteAuthor)
  @Expose()
  public quoteAuthor: string;

  @ApiProperty(PostApiProperty.ImagePath)
  @Expose()
  public imagePath: string;

  @ApiProperty(PostApiProperty.LinkDescription)
  @Expose()
  public linkDescription: string;

  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;

  @ApiProperty(PostApiProperty.LikesCount)
  @Expose()
  public likesCount: number;

  @ApiProperty(PostApiProperty.CommentsCount)
  @Expose()
  public commentsCount: number;
}
