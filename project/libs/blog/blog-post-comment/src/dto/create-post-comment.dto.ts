import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { PostCommentMessageValidateMessage, PostCommentMessageValidation } from '../blog-post-comment.constant';
import { PostCommentApiProperty } from '../blog-post-comment.constant.property';

export class CreatePostCommentDto {
  @ApiProperty(PostCommentApiProperty.Message)
  @IsString()
  @MinLength(PostCommentMessageValidation.MinLength, PostCommentMessageValidateMessage.MinLength)
  @MaxLength(PostCommentMessageValidation.MaxLength, PostCommentMessageValidateMessage.MaxLength)
  public message: string;
}
