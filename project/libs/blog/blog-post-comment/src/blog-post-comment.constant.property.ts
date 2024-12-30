//! копия из другой либы, может нужно либа с описанием?
export const PostCommentApiProperty = {
  PostId: {
    description: 'The uniq post ID',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  },
  Message: {
    description: 'Comment message',
    example: 'Comment message, comment message'
  },
  UserId: {
    description: 'UserId',
    example: '658170cbb954e9f5b905ccf4'
  },
  CreatedAt: {
    description: 'Comment date',
    example: '2024-12-27T08:29:40.245Z'
  }
} as const;
