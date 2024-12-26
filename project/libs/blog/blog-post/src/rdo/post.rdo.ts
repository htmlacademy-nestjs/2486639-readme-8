import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostType } from '@project/shared/core';

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

  //! использовать новые свойства
  /*
  @ApiProperty(PostApiProperty.Data)
  @Expose()
  public data: PostData;
  */
}
