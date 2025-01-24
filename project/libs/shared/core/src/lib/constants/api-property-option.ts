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
    registrationDate: {
      description: 'The user registration date',
      type: 'string',
      example: '2025-01-20'
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
