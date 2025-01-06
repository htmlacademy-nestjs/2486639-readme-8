import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { PostCommentMessageValidation } from '../blog-post-comment.constant';
import { PostCommentApiProperty } from '../blog-post-comment.constant.property';

export class CreatePostCommentDto {
  @ApiProperty(PostCommentApiProperty.Message)
  @IsString()
  @MinLength(PostCommentMessageValidation.MinLength)
  @MaxLength(PostCommentMessageValidation.MaxLength)
  public message: string;
}
