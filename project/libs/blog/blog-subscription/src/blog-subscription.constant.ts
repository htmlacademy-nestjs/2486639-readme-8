import { HttpStatus } from '@nestjs/common';

export const BlogSubscriptionMessage = {
  PostNotFound: 'Post not found.',
  LikeNotFound: 'Like not found.',
  LikeExist: 'You already liked the post.'
} as const;

export const PostCommentApiProperty = {
  PostId: {
    description: 'The unique post ID',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  }
} as const;

export const authorUserIdApiParam = {
  name: 'authorUserId',
  schema: PostCommentApiProperty.PostId
} as const;

export const AUTHOR_USER_ID_PARAM = `:${authorUserIdApiParam.name}`;

export const BlogSubscriptionApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  SubscriptionCreated: {
    status: HttpStatus.CREATED,
    description: 'The like has been successfully created.'
  },
  SubscriptionDeleted: {
    status: HttpStatus.NO_CONTENT,
    description: 'The like has been successfully deleted.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogSubscriptionMessage.PostNotFound
  },
  LikeNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogSubscriptionMessage.LikeNotFound
  },
  LikeOnPostExist: {
    status: HttpStatus.CONFLICT,
    description: BlogSubscriptionMessage.LikeExist
  }
} as const;
