import { HttpStatus } from '@nestjs/common';

import { PostType } from '@project/shared/core';

import { PostApiProperty } from './blog-post.constant.property';
import { PostRdo } from './rdo/post.rdo';

export const PostValidation = {
  Title: {
    MinLength: 20,
    MaxLength: 50
  }
} as const;

export const PostValidateMessage = {
  Type: {
    message: `Type must by one of ${Object.values(PostType).join(', ')}`
  },
  Title: {
    MinLength: { message: `Minimum title length must be ${PostValidation.Title.MinLength}` },
    MaxLength: { message: `Maximum title length must be ${PostValidation.Title.MaxLength}` }
  }
} as const;

export const BlogPostMessage = {
  NotFound: 'Post not found'
} as const;

export const PostIdApiParam = {
  name: 'postId',
  schema: PostApiProperty.Id
} as const;

export const BlogPostApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  NotAllow: {
    status: HttpStatus.FORBIDDEN,
    description: 'Post is not yours.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  PostCreated: {
    type: PostRdo,
    status: HttpStatus.CREATED,
    description: 'The new post has been successfully created.'
  },
  PostUpdated: {
    type: PostRdo,
    status: HttpStatus.OK,
    description: 'The post has been successfully updated.'
  },
  PostDeleted: {
    status: HttpStatus.OK,
    description: 'The post has been successfully deleted.'
  },
  PostFound: {
    type: PostRdo,
    status: HttpStatus.OK,
    description: 'Post found'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.NotFound
  }
} as const;
