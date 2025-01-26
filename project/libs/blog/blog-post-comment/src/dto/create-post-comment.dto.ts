import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { ApiPropertyOption } from '@project/shared/core';

import { PostCommentMessageValidation } from '../blog-post-comment.constant';

export class CreatePostCommentDto {
  @ApiProperty(ApiPropertyOption.Comment.Message)
  @IsString()
  @MinLength(PostCommentMessageValidation.MinLength)
  @MaxLength(PostCommentMessageValidation.MaxLength)
  public message: string;
}
