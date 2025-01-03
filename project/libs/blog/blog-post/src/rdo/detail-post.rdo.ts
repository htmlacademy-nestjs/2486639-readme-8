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

  @ApiProperty(PostApiProperty.State)
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

  //! ApiProperty
  //@Expose({ name: 'repostedPostId', until: 2 })
  @Expose()
  @Transform(({ value, key, obj, type, options }) => {
    //((key === 'repostedPostId') && !!obj.repostedPostId)
    console.log('value', value);
    console.log('key', key);
    console.log('obj', obj);
    console.log('type', type);
    console.log('options', options);

    return !!obj.repostedPostId;
  })
  public isRepost: boolean;

  //! ApiProperty
  //@Expose({ name: 'repostedPostId', until: 2 })
  @Expose()
  public repostedPostId: string;

  //! ApiProperty
  //@Expose({ name: 'repostedPostId' })
  @Expose()
  //@Transform(({ value }) => ((!value) ? '' : value.userId))
  public repostedPostUserId: string;

  @Expose()
  public userId: string;
}
