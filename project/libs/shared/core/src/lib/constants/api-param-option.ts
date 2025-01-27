import { ApiPropertyOption } from './api-property-option';

export const ApiParamOption = {
  UserId: {
    name: 'userId',
    schema: ApiPropertyOption.User.Id
  },
  PostId: {
    name: 'postId',
    schema: ApiPropertyOption.Post.Id
  },
  CommentId: {
    name: 'commentId',
    schema: ApiPropertyOption.Comment.Id
  }
} as const;

export const USER_ID_PARAM = `:${ApiParamOption.UserId.name}`;
export const POST_ID_PARAM = `:${ApiParamOption.PostId.name}`;
export const COMMENT_ID_PARAM = `:${ApiParamOption.CommentId.name}`;
