import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { PostCommentValidateMessage, PostCommentValidation } from '../blog-post-comment.constant';
import { PostCommentApiProperty } from '../blog-post-comment.constant.property';

export class CreatePostCommentDto {
  @ApiProperty(PostCommentApiProperty.Message)
  @IsString()
  @MinLength(PostCommentValidation.message.minLength, PostCommentValidateMessage.message.minLength)
  @MaxLength(PostCommentValidation.message.maxLength, PostCommentValidateMessage.message.maxLength)
  public message: string;
}
