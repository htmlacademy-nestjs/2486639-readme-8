import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PostCommentApiProperty } from '../blog-post-comment.constant.property';

export class PostCommentRdo {
  @ApiProperty(PostCommentApiProperty.Message)
  @Expose()
  public message: string;

  @ApiProperty(PostCommentApiProperty.UserId)
  @Expose()
  public userId: string;

  @ApiProperty(PostCommentApiProperty.CreatedAt)
  @Expose()
  public createdAt: Date;
}
