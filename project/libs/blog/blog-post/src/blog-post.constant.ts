import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

import { ApiPropertyOption, DetailPostWithUserIdRdo, PostState, PostType, SortType } from '@project/shared/core';

import { PostRdo } from './rdo/post.rdo';
import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { UserPostsCountRdo } from './rdo/user-posts-count.rdo';

export const Default = {
  NEW_POST_STATE: PostState.Published,
  POST_COUNT: 25,
  CURRENT_PAGE: 1,
  SORT_TYPE: SortType.PublishDate,
  SEACRH_TITLE_POST_COUNT: 20,
  NEWS_LETTER_POST_COUNT: 10
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
      fileIsRequired: ApiPropertyOption.Post.ImageFile.required,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }
  }
} as const;

export const parseFilePipeBuilder =
  new ParseFilePipeBuilder()
    .addFileTypeValidator(PostValidation.ImageFile.Type)
    .addMaxSizeValidator(PostValidation.ImageFile.MaxSize)
    .build(PostValidation.ImageFile.Build);

export const PostQueryApiProperty = {
  SortType: {
    description: 'The sorting type',
    enum: SortType,
    example: SortType.PublishDate,
    required: false
  },
  Tag: {
    description: 'The post tag',
    example: 'tag1',
    required: false
  },
  Title: {
    description: 'The title for search posts',
    example: 'title1 title2'
  }
} as const;

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
  RepostExist: 'You already reposted this post.',
  Unauthorized: 'Unauthorized.'
} as const;

export const BlogPostApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: BlogPostMessage.Unauthorized
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
    type: DetailPostWithUserIdRdo,
    status: HttpStatus.CREATED,
    description: 'The new post has been successfully created.'
  },
  PostUpdated: {
    type: DetailPostWithUserIdRdo,
    status: HttpStatus.OK,
    description: 'The post has been successfully updated.'
  },
  PostReposted: {
    type: DetailPostWithUserIdRdo,
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
    type: DetailPostWithUserIdRdo,
    status: HttpStatus.OK,
    description: 'Post found.'
  },
  PostsFound: {
    type: PostWithPaginationRdo,
    status: HttpStatus.OK,
    description: 'Posts found.'
  },
  SearchPosts: {
    type: PostRdo,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Posts found.'
  },
  PostNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogPostMessage.NotFound
  },
  UserPostsCount: {
    type: UserPostsCountRdo,
    status: HttpStatus.OK,
    description: 'User posts count.'
  }
} as const;
