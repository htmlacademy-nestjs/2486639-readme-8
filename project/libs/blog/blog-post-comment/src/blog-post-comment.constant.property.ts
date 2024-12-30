import { PostType } from "@project/shared/core";

export const PostApiProperty = {
  Id: {
    description: 'The uniq post ID',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  },
  Type: {
    description: 'The post type',
    enum: PostType,
    example: PostType.Video
  },
  Tags: {
    description: 'The post tags',
    example: ["tag1, rag2"]
  },
  Data: {
    description: 'The post data',
    example: "123213123123"
  }
} as const;
