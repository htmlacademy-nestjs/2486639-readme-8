import { HttpStatus } from '@nestjs/common';

import { CommentWithUserIdAndPaginationRdo, CommentWithUserIdRdo } from '@project/shared/core';

export const Default = {
  CURRENT_PAGE: 1,
  COMMENT_COUNT: 50
} as const;

export const PostCommentMessageValidation = {
  MinLength: 10,
  MaxLength: 300
} as const;

export const BlogPostCommentMessage = {
  Unauthorized: 'Unauthorized.',
  PostNotFound: 'Post not found.',
  CommentNotFound: 'Comment not found.',
  CommentExist: 'You already commented the post.'
} as const;

export const BlogPostCommentApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostCommentMessage.Unauthorized
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  PostCommentCreated: {
    type: CommentWithUserIdRdo,
    status: HttpStatus.CREATED,
    description: 'The new comment has been successfully created.'
  },
  PostCommentsFound: {
    type: CommentWithUserIdAndPaginationRdo,
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
