import { PostState, PostType } from '@project/shared/core';

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
  State: {
    description: 'The post state',
    enum: PostState,
    example: PostState.Published
  },
  PublishDate: {
    description: 'The post publish date',
    example: "2024-07-09T11:24:14.495Z"
  },
  Tags: {
    description: 'The post tags',
    example: ["tag1, tag2"]
  },
  Title: {
    description: 'The post title for types: video and text',
    example: "description, description"
  },
  Url: {
    description: 'The post url for types: video and link',
    example: "http://local.ru/12345"
  },
  PreviewText: {
    description: 'The post preview text for type: text',
    example: "preview text preview text"
  },
  Text: {
    description: 'The post text for type: text',
    example: "text text text text text text text"
  },
  QuoteText: {
    description: 'The post quote text for type: quote',
    example: "quote text quote text"
  },
  QuoteAuthor: {
    description: 'The post quote author for type: quote',
    example: "quote author"
  },
  ImagePath: {
    description: 'The post image path for type: photo',
    example: "/img/12345.jpg"
  },
  LinkDescription: {
    description: 'The post link description for type: link',
    example: "link description"
  }
} as const;
