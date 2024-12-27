import { ApiProperty, } from "@nestjs/swagger";

import { PostState, PostType, Tag } from "@project/shared/core";

import { PostApiProperty } from "../blog-post.constant.property";

export class CreatePostDto {
  @ApiProperty(PostApiProperty.Type)
  public type: PostType;

  @ApiProperty(PostApiProperty.Tags)
  public tags: Tag[];

  public title: string;
  public url: string;
  public previewText: string;
  public text: string;
  public quoteText: string;
  public quoteAuthor: string;
  public imagePath: string;
  public urlDescription: string;

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
