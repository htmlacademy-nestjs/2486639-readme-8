import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { PostState, PostType } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';

export class DetailPostRdo {
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

  @ApiProperty({
    ...PostApiProperty.State,
    required: true
  })
  @Expose()
  public state: PostState;

  @ApiProperty(PostApiProperty.PublishDate)
  @Expose()
  public publishDate: Date;

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

  @ApiProperty(PostApiProperty.IsRepost)
  @Expose()
  @Transform(({ obj }) => (!!obj.repostedPost?.id))
  public isRepost: boolean;

  @ApiProperty(PostApiProperty.RepostedPostId)
  @Expose()
  @Transform(({ obj }) => (obj.repostedPost?.id))
  public repostedPostId: string;

  @ApiProperty(PostApiProperty.RepostedPostUserId)
  @Expose()
  @Transform(({ obj }) => (obj.repostedPost?.userId))
  public repostedPostUserId: string;

  @ApiProperty(PostApiProperty.UserId)
  @Expose()
  public userId: string;

  @ApiProperty(PostApiProperty.LikesCount)
  @Expose()
  public likesCount: number;

  @ApiProperty(PostApiProperty.CommentsCount)
  @Expose()
  public commentsCount: number;
}
