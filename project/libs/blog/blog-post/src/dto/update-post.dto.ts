import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import { PostData, PostType } from "@project/shared/core";

import { PostApiProperty } from "../blog-post.constant.property";

export class UpdatePostDto {
  @ApiProperty(PostApiProperty.Type)
  @IsOptional()
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  @IsOptional()
  public tags: string[];

  @ApiProperty(PostApiProperty.Data)
  @IsOptional()
  public data: PostData;
}
