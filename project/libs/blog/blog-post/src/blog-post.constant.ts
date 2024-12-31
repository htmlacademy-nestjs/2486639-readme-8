import { HttpStatus } from '@nestjs/common';

import { PostType } from '@project/shared/core';

import { PostApiProperty } from './blog-post.constant.property';
import { PostRdo } from './rdo/post.rdo';


export const PostValidation = {
  message: {
    minLength: 10,
    maxLength: 300
  }
} as const;

export const PostValidateMessage = {
  Type: {
    message: `Type must by one of ${Object.values(PostType).join(', ')}`
  },
  message: {
    minLength: { message: `Minimum message length must be ${PostValidation.message.minLength}` },
    maxLength: { message: `Maximum message length must be ${PostValidation.message.maxLength}` }
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
