export const PostCommentApiProperty = {
  Id: {
    description: 'Comment id',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  },
  Message: {
    description: 'Comment message',
    example: 'Comment message, comment message'
  },
  UserId: {
    description: 'The unique user ID',
    example: '658170cbb954e9f5b905ccf4'
  },
  CreatedAt: {
    description: 'Comment date',
    example: '2024-12-27T08:29:40.245Z'
  },
  PostId: {
    description: 'The unique post ID',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  }
} as const;
