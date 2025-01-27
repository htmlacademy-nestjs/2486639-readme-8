import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { ApiPropertyOption, PostState, PostType, transformDate } from '@project/shared/core';

import { BasePostDto } from './base-post.dto';

export class UpdatePostDto extends BasePostDto {
  @ApiProperty({ ...ApiPropertyOption.Post.Type, required: false })
  @IsOptional()
  @IsString()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiProperty({
    ...ApiPropertyOption.Post.State,
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum(PostState)
  public state?: PostState;

  @ApiProperty({
    ...ApiPropertyOption.Post.PublishDate,
    required: false
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @Transform(transformDate)
  public publishDate?: string;
}
