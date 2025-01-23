export const ApiPropertyOption = {
  User: {
    Id: {
      description: 'The unique user ID',
      example: '658170cbb954e9f5b905ccf4'
    },
    Email: {
      description: 'The unique user email',
      example: 'user@local.local'
    },
    Name: {
      description: 'The user name',
      example: 'Name'
    },
    Password: {
      description: 'The user password',
      example: 'password'
    },
    AvatarPath: {
      description: 'The user avatar path',
      example: '/img/avatar.jpg'
    },
    AvatarFile: {
      required: false,
      description: 'The avatar file',
      type: 'string',
      format: 'binary'
    },
    AccessToken: {
      description: 'The user access JWT token',
      example: 'asdasdsdfetyhetyhythgfnghnlkcsdkfajowfjlsdkmcv'
    },
    RefreshToken: {
      description: 'The user refresh JWT token',
      example: 'fvdfvbdgbsdfbfgbfgfghdr6he5656hsrthsfhfg'
    }
  },
  Post: {
    Id: {
      description: 'The unique post ID',
      example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
    }
  }
} as const;

export const ApiParamOption = {
  UserId: {
    name: 'userId',
    schema: ApiPropertyOption.User.Id
  },
  PostId: {
    name: 'postId',
    schema: ApiPropertyOption.Post.Id
  }
} as const;

export const USER_ID_PARAM = `:${ApiParamOption.UserId.name}`;
export const POST_ID_PARAM = `:${ApiParamOption.PostId.name}`;
