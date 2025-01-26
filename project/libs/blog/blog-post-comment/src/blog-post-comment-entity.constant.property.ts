import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentApiProperty } from './blog-post-comment.constant.property';

//! перенести в константы, когда типы будут в core
export const EntityApiProperty = {
  Entities: {
    description: 'The post comments',
    isArray: true,
    type: PostCommentRdo,
    //! должно работать без примера
    example: [{
      message: PostCommentApiProperty.Message.example,
      userId: PostCommentApiProperty.UserId.example,
      createdAt: PostCommentApiProperty.CreatedAt.example
    }]
  }
} as const;
