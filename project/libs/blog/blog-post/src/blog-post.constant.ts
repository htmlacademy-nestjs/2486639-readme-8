import { HttpStatus } from '@nestjs/common';

import { PostState, PostType } from '@project/shared/core';

import { PostApiProperty } from './blog-post.constant.property';
import { PostRdo } from './rdo/post.rdo';

export const PostValidation = {
  Tags: {
    MaxCount: 8,
    MinLength: 3,
    MaxLength: 10,
    RegExp: /^[a-zA-Zа-юА-Ю]{1}[a-zA-Zа-юА-Ю0-9-]{2,10}$/
  },
  Title: {
    MinLength: 20,
    MaxLength: 50
  },
  PreviewText: {
    MinLength: 50,
    MaxLength: 255
  },
  Text: {
    MinLength: 100,
    MaxLength: 1024
  },
  QuoteText: {
    MinLength: 20,
    MaxLength: 300
  },
  QuoteAuthor: {
    MinLength: 3,
    MaxLength: 50
  },
  LinkDescription: {
    MaxLength: 300
  },
} as const;

export const PostValidateMessage = {
  Type: {
    message: `Type must by one of ${Object.values(PostType).join(', ')}`
  },
  State: {
    message: `State must by one of ${Object.values(PostState).join(', ')}`
  },
  Tags: {
    MinLength: {
      message: `Minimum tag length must be ${PostValidation.Tags.MinLength}`,
      each: true
    },
    MaxLength: {
      message: `Maximum tag length must be ${PostValidation.Tags.MaxLength}`,
      each: true
    }
  },
  Url: {
    message: 'URL must by valid url'
  },
  Title: {
    MinLength: { message: `Minimum title length must be ${PostValidation.Title.MinLength}` },
    MaxLength: { message: `Maximum title length must be ${PostValidation.Title.MaxLength}` }
  },
  PreviewText: {
    MinLength: { message: `Minimum preview text length must be ${PostValidation.PreviewText.MinLength}` },
    MaxLength: { message: `Maximum preview text length must be ${PostValidation.PreviewText.MaxLength}` }
  },
  Text: {
    MinLength: { message: `Minimum text length must be ${PostValidation.Text.MinLength}` },
    MaxLength: { message: `Maximum text length must be ${PostValidation.Text.MaxLength}` }
  },
  QuoteText: {
    MinLength: { message: `Minimum quote text length must be ${PostValidation.QuoteText.MinLength}` },
    MaxLength: { message: `Maximum quote text length must be ${PostValidation.QuoteText.MaxLength}` }
  },
  QuoteAuthor: {
    MinLength: { message: `Minimum quote author length must be ${PostValidation.QuoteAuthor.MinLength}` },
    MaxLength: { message: `Maximum quote author length must be ${PostValidation.QuoteAuthor.MaxLength}` }
  },
  LinkDescription: {
    MaxLength: { message: `Maximum link description length must be ${PostValidation.LinkDescription.MaxLength}` }
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
