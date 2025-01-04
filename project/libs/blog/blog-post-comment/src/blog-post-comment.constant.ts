import { HttpStatus } from '@nestjs/common';

import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentApiProperty } from './blog-post-comment.constant.property';

export const PostCommentMessageValidation = {
  MinLength: 10,
  MaxLength: 300
} as const;

export const PostCommentMessageValidateMessage = {
  MinLength: { message: `Minimum message length must be ${PostCommentMessageValidation.MinLength}` },
  MaxLength: { message: `Maximum message length must be ${PostCommentMessageValidation.MaxLength}` }
} as const;

export const BlogPostCommentMessage = {
  PostNotFound: 'Post not found.',
  CommentNotFound: 'Comment not found.',
  CommentExist: 'You already commented the post.'
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
    status: HttpStatus.NO_CONTENT,
    description: 'The comment has been successfully deleted.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostCommentMessage.PostNotFound
  },
  CommentNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostCommentMessage.CommentNotFound
  },
  CommentOnPostExist: {
    status: HttpStatus.CONFLICT,
    description: BlogPostCommentMessage.CommentExist
  }
} as const;
