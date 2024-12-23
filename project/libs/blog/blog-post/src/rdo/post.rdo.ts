import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostData, PostType } from '@project/shared/core';

import { BlogPostApiProperty } from '../blog-post.constant.property';

export class PostRdo {
  @ApiProperty(BlogPostApiProperty.Post.Id)
  @Expose()
  public id: string;

  @ApiProperty(BlogPostApiProperty.Post.Type)
  @Expose()
  public type: PostType;

  @ApiProperty(BlogPostApiProperty.Post.Tags)
  @Expose()
  public tags: string[];

  @ApiProperty(BlogPostApiProperty.Post.Data)
  @Expose()
  public data: PostData;
}
