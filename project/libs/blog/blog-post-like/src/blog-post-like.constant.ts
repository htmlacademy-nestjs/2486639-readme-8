import { HttpStatus } from '@nestjs/common';

export const BlogPostLikeMessage = {
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

export const PostIdApiParam = {
  name: 'postId',
  schema: PostCommentApiProperty.PostId
} as const;

export const POST_ID_PARAM = `:${PostIdApiParam.name}`;

export const BlogPostLikeApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  PostLikeCreated: {
    status: HttpStatus.CREATED,
    description: 'The like has been successfully created.'
  },
  PostLikeDeleted: {
    status: HttpStatus.NO_CONTENT,
    description: 'The like has been successfully deleted.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostLikeMessage.PostNotFound
  },
  LikeNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostLikeMessage.LikeNotFound
  },
  LikeOnPostExist: {
    status: HttpStatus.CONFLICT,
    description: BlogPostLikeMessage.LikeExist
  }
} as const;
