import { ApiProperty, } from "@nestjs/swagger";

import { PostType } from "@project/shared/core";

import { PostApiProperty } from "../blog-post.constant.property";

export class CreatePostDto {
  @ApiProperty(PostApiProperty.Type)
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  public tags: string[];

  //! использовать новые свойства
  /*
  @ApiProperty({
    oneOf: [
      {
        type: 'object',
        properties: {
          a1: {
            type: 'string'
          }
        }
      },
      {
        type: 'object',
        properties: {
          b1: {
            type: 'string'
          }
        }
      }
    ],
  })
  public data: PostData;
  */
}
