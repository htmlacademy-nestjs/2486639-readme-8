import { HttpStatus } from '@nestjs/common';

import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentApiProperty } from './blog-post-comment.constant.property';

export const PostCommentValidation = {
  message: {
    minLength: 10,
    maxLength: 300
  }
} as const;

export const PostCommentValidateMessage = {
  message: {
    minLength: { message: `Minimum message length must be ${PostCommentValidation.message.minLength}` },
    maxLength: { message: `Maximum message length must be ${PostCommentValidation.message.maxLength}` }
  }
} as const;

export const BlogPostCommentMessage = {
  PostNotFound: 'Post not found.'
} as const;

export const PostIdApiParam = {
  name: 'postId',
  schema: PostCommentApiProperty.PostId
} as const;

export const POST_ID_PARAM = `:${PostIdApiParam.name}`;

export const BlogPostCommentApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  PostCommentCreated: {
    type: PostCommentRdo,
    status: HttpStatus.CREATED,
    description: 'The new comment has been successfully created.'
  },
  PostCommentsFound: {
    type: PostCommentRdo,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Post comments found.'
  },
  PostCommentDeleted: {
    status: HttpStatus.OK,
    description: 'The comment has been successfully deleted.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostCommentMessage.PostNotFound
  }
} as const;
