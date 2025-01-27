import { Comment } from '../libs/shared/core/src/lib/types/comment.interface';
import { PostState } from '../libs/shared/core/src/lib/types/post-state.enum';
import { PostType } from '../libs/shared/core/src/lib/types/post-type.enum';
import { Post } from '../libs/shared/core/src/lib/types/post.interface';
import { MOCK_USERS } from './users';

export const MOCK_TAGS = [
  { id: '2067063f-8dc2-42bc-bb5f-84bce5caa9fd', title: 'tag1' },
  { id: '8392ec79-66b5-4fe5-b3b8-170ff8156b1b', title: 'tag2' },
  { id: '3fa161f7-c66c-409e-a5d5-1a159c84ad81', title: 'tag3' },
  { id: '48568f914-0595-4ffe-a1e2-b333b1eb3275', title: 'tag4' }
] as const;

export const MOCK_POSTS: Post[] = [
  {
    id: '2f31b19b-97eb-4305-877a-0b9be7faca8f',
    type: PostType.Video,
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
    state: PostState.Published,
    title: 'Post1 Post1 Post1 Post1',
    url: 'https://video.ru/12345',
    previewText: undefined,
    text: undefined,
    quoteText: undefined,
    quoteAuthor: undefined,
    imagePath: undefined,
    linkDescription: undefined,
    userId: MOCK_USERS[0].id as string
  },
  {
    id: '9059dee5-7897-46d3-b8f6-e075a8b568c0',
    type: PostType.Quote,
    tags: [MOCK_TAGS[1], MOCK_TAGS[2]],
    state: PostState.Published,
    title: undefined,
    url: undefined,
    previewText: undefined,
    text: undefined,
    quoteText: 'quote text quote text quote text quote text',
    quoteAuthor: 'quote author quote author',
    imagePath: undefined,
    linkDescription: undefined,
    userId: MOCK_USERS[1].id as string
  },
  {
    id: 'eab06dc6-ba52-4169-a369-f2f825d44ebb',
    type: PostType.Link,
    tags: [MOCK_TAGS[2], MOCK_TAGS[3]],
    state: PostState.Published,
    title: undefined,
    url: 'https://url.ru/123456',
    previewText: undefined,
    text: undefined,
    quoteText: undefined,
    quoteAuthor: undefined,
    imagePath: undefined,
    linkDescription: 'link description link description link description',
    userId: MOCK_USERS[2].id as string
  }
] as const;

export const MOCK_COMMENTS: Comment[] = [
  {
    id: '79668254-2673-4f8b-9bda-f3b726a466dd',
    message: 'comment1 comment1 comment1 comment1',
    postId: MOCK_POSTS[0].id as string,
    userId: MOCK_USERS[1].id as string
  },
  {
    id: 'f08feedf-59a8-48a5-9001-4db53173f06c',
    message: 'comment2 comment2 comment2 comment2 comment2 comment2',
    postId: MOCK_POSTS[1].id as string,
    userId: MOCK_USERS[0].id as string
  },
  {
    id: '660be995-82b7-4eed-be0d-dd317d730c8e',
    message: 'comment3 comment3 comment3 comment3 comment3 comment3 comment3 comment3',
    postId: MOCK_POSTS[1].id as string,
    userId: MOCK_USERS[2].id as string
  }
] as const;

export const MOCK_SUBSCRIPTIONS = [
  {
    id: '06024a6d-2fce-414f-8724-22b648c1293a',
    authorUserId: MOCK_USERS[0].id,
    userId: MOCK_USERS[1].id
  }
] as const;
