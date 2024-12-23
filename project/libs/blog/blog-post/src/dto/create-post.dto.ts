import { ApiProperty } from "@nestjs/swagger";

import { PostData, PostType } from "@project/shared/core";

import { PostApiProperty } from "../blog-post.constant.property";

export class CreatePostDto {
  @ApiProperty(PostApiProperty.Type)
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  public tags: string[];

  @ApiProperty(PostApiProperty.Data)
  public data: PostData;
}
