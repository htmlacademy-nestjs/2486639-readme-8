import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ApiPropertyOption, PostType } from '@project/shared/core';

import { BasePostDto } from './base-post.dto';

export class CreatePostDto extends BasePostDto {
  @ApiProperty(ApiPropertyOption.Post.Type)
  @IsString()
  @IsEnum(PostType)
  public type: PostType;
}
