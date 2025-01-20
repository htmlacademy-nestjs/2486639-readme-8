import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostApiProperty } from '../blog-post.constant.property';

export class UserPostsCountRdo {
  @ApiProperty(PostApiProperty.UserId)
  @Expose()
  public userId: string;

  @ApiProperty(PostApiProperty.PostsCount)
  @Expose()
  public postsCount: number;
}
