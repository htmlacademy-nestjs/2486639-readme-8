import { HttpStatus } from '@nestjs/common';

//!import { PostCommentApiProperty } from './blog-post-comment.constant.property';

export const BlogPostLikeMessage = {
  PostNotFound: 'Post not found.',
  LikeNotFound: 'Like not found.',
  LikeExist: 'You already liked the post.'
} as const;

export const PostIdApiParam = {
  name: 'postId',
  //!schema: PostCommentApiProperty.PostId
} as const;

export const POST_ID_PARAM = `:${PostIdApiParam.name}`;

export const BlogPostLikeApiResponse = {
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
