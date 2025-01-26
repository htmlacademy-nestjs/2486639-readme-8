import { HttpStatus } from '@nestjs/common';

export const BlogPostLikeMessage = {
  Unauthorized: 'Unauthorized.',
  PostNotFound: 'Post not found.',
  LikeNotFound: 'Like not found.',
  LikeExist: 'You already liked the post.'
} as const;

export const BlogPostLikeApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostLikeMessage.Unauthorized
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
