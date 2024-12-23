import { ApiProperty } from "@nestjs/swagger";

import { PostData, PostType } from "@project/shared/core";

import { BlogPostApiProperty } from "../blog-post.constant.property";

export class UpdatePostDto {
  //@IsOptional()  //! ?
  @ApiProperty(BlogPostApiProperty.Post.Type)
  public type: PostType;

  @ApiProperty(BlogPostApiProperty.Post.Tags)
  public tags: string[];

  @ApiProperty(BlogPostApiProperty.Post.Data)
  public data: PostData;
}
