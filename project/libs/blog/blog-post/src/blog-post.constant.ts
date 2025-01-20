import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

import { PostState, PostType, SortType } from '@project/shared/core';

import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { DetailPostRdo } from './rdo/detail-post.rdo';
import { UserPostsCountRdo } from './rdo/user-posts-count.rdo';
import { PostApiProperty } from './blog-post.constant.property';

export const ONLY_DATE_FORMAT = 'YYYY-MM-DD';

export const Default = {
  NEW_POST_STATE: PostState.Published,
  POST_COUNT: 25,
  CURRENT_PAGE: 1,
  SORT_TYPE: SortType.Date
} as const;

export const ImageOption = {
  KEY: 'imageFile',
  MAX_SIZE: 1204 * 1024,
  MIME_TYPES: ['image/jpg', 'image/jpeg', 'image/png']
} as const;

export const PostValidation = {
  Tags: {
    MaxCount: 8,
    TagMinLength: 3,
    TagMaxLength: 10,
    TagRegexp: /^[a-zA-Zа-юА-Ю]{1}[a-zA-Zа-юА-Ю0-9-]{2,10}$/
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
  ImageFile: {
    Type: { fileType: ImageOption.MIME_TYPES.join('|') },
    MaxSize: { maxSize: ImageOption.MAX_SIZE },
    Build: {
      fileIsRequired: PostApiProperty.ImageFile.required,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }
  }
} as const;

export const parseFilePipeBuilder =
  new ParseFilePipeBuilder()
    .addFileTypeValidator(PostValidation.ImageFile.Type)
    .addMaxSizeValidator(PostValidation.ImageFile.MaxSize)
    .build(PostValidation.ImageFile.Build);

export enum PostField {
  Title = 'title',
  Url = 'url',
  PreviewText = 'previewText',
  Text = 'text',
  QuoteText = 'quoteText',
  QuoteAuthor = 'quoteAuthor',
  ImageFile = 'imageFile',
  LinkDescription = 'linkDescription'
};

export const PostFieldsByType = {
  [PostType.Video]: [PostField.Title, PostField.Url],
  [PostType.Text]: [PostField.Title, PostField.PreviewText, PostField.Text],
  [PostType.Link]: [PostField.Url, PostField.LinkDescription],
  [PostType.Quote]: [PostField.QuoteText, PostField.QuoteAuthor],
  [PostType.Photo]: [PostField.ImageFile]
} as const;

export const BlogPostMessage = {
  NotFound: 'Post not found.',
  NotAllow: 'Post is not yours.',
  RepostExist: 'You already reposted this post.'
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
    description: BlogPostMessage.NotAllow
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  PostCreated: {
    type: DetailPostRdo,
    status: HttpStatus.CREATED,
    description: 'The new post has been successfully created.'
  },
  PostUpdated: {
    type: DetailPostRdo,
    status: HttpStatus.OK,
    description: 'The post has been successfully updated.'
  },
  PostReposted: {
    type: DetailPostRdo,
    status: HttpStatus.CREATED,
    description: 'The post has been successfully reposted.'
  },
  AlreadyReposted: {
    status: HttpStatus.CONFLICT,
    description: BlogPostMessage.RepostExist
  },
  PostDeleted: {
    status: HttpStatus.NO_CONTENT,
    description: 'The post has been successfully deleted.'
  },
  PostFound: {
    type: DetailPostRdo,
    status: HttpStatus.OK,
    description: 'Post found.'
  },
  PostsFound: {
    type: PostWithPaginationRdo, //! наверное будет тип с пагинацией
    status: HttpStatus.OK,
    description: 'Posts found.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.NotFound
  },
  UserInfo: {
    type: UserPostsCountRdo,
    status: HttpStatus.OK,
    description: 'User info.'
  }
} as const;
