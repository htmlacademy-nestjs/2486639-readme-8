import { PostState, PostType, SortType } from '@project/shared/core';

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
    example: "2024-07-09"
  },
  Tags: {
    description: 'The post tags',
    example: ["tag1", "tag2"]
  },
  // для формирования "for types:..." можно применить PostFieldsByType, но данные поля по типам, а тут нужно типы по полям
  Title: {
    description: 'The post title for types: video and text',
    required: false,
    example: "description, description"
  },
  Url: {
    description: 'The post url for types: video and link',
    required: false,
    example: "http://local.ru/12345"
  },
  PreviewText: {
    description: 'The post preview text for type: text',
    required: false,
    example: "preview text preview text preview text preview text"
  },
  Text: {
    description: 'The post text for type: text',
    required: false,
    example: "text text text text text text text text text text text text text text text text text text text text text"
  },
  QuoteText: {
    description: 'The post quote text for type: quote',
    required: false,
    example: "quote text quote text"
  },
  QuoteAuthor: {
    description: 'The post quote author for type: quote',
    required: false,
    example: "quote author"
  },
  ImagePath: {
    description: 'The post image path for type: photo',
    required: false,
    example: "/img/12345.jpg"
  },
  LinkDescription: {
    description: 'The post link description for type: link',
    required: false,
    example: "link description"
  },
  //
  IsRepost: {
    description: 'The post is repost attribute',
    example: "true"
  },
  RepostedPostId: {
    description: 'The reposted post id',
    required: false,
    example: "2f31b19b-97eb-4305-877a-0b9be7faca8f"
  },
  RepostedPostUserId: {
    description: 'The reposted post user id',
    required: false,
    example: "658170cbb954e9f5b905ccf4"
  },
  UserId: {
    description: 'The post user id',
    example: "658170cbb954e9f5b905ccf4"
  },
  LikesCount: {
    description: 'The post likes count',
    example: "5"
  },
  CommentsCount: {
    description: 'The post comments count',
    example: "5"
  }
} as const;

export const PostQueryApiProperty = {
  SortType: {
    description: 'The sorting type',
    enum: SortType,
    example: SortType.Date,
    required: false
  },
  ShowDraft: {
    description: 'The post state is draft',
    example: true,
    required: false
  },
  Tag: {
    description: 'The post tag',
    example: "tag1",
    required: false
  },
  Page: {
    description: 'The page',
    example: 1,
    required: false
  }
} as const;
