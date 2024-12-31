import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostState, PostType, User } from '@project/shared/core';

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
  public tags: string[];

  @ApiProperty(PostApiProperty.State)
  @Expose()
  public state: PostState;

  @Expose()
  public publishDate: Date;

  public repostedPost: PostRdo; //! как наполнить и в рекусию не уйти... или гдето есть финиш... глянуть по ТЗ навернео один уровень только нужен
  public repostedPostUser: User; //! по ТЗ нужно отдать

  /*

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
     */
  @Expose()
  public user: User;

  @Expose()
  public title: string;

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
