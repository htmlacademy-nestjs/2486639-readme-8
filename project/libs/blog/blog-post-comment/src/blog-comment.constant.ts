import { HttpStatus } from "@nestjs/common";

import { PostApiProperty } from "./blog-post.constant.property";
import { PostRdo } from "./rdo/post.rdo";

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
