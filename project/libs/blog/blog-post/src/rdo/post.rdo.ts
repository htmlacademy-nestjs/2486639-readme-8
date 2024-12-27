import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostState, PostType, Tag, User } from '@project/shared/core';

import { PostApiProperty } from '../blog-post.constant.property';

export class PostRdo {
  @ApiProperty(PostApiProperty.Id)
  @Expose()
  public id: string;

  @ApiProperty(PostApiProperty.Type)
  @Expose()
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @Expose()
  public tags: Tag[];

  @Expose()
  public publishDate: Date;

  public repostedPost: PostRdo; //! как наполнить и в рекусию не уйти... или гдето есть финиш... глянуть по ТЗ навернео один уровень только нужен
  public repostedPostUser: User; //! по ТЗ нужно отдать

  @Expose()
  public state: PostState;

  @Expose()
  public user: User;

  @Expose()
  public url: string;

  @Expose()
  public previewText: string;

  @Expose()
  public text: string;

  @Expose()
  public quoteText: string;

  @Expose()
  public quoteAuthor: string;

  @Expose()
  public imagePath: string;

  @Expose()
  public linkDescription: string;

  //! использовать новые свойства
  /*
  @ApiProperty(PostApiProperty.Data)
  @Expose()
  public data: PostData;
  */
}
