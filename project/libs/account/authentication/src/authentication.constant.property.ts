// дополнительный файл с константами, т.к. были ошибки при сборке webpack, ругался AuthenticationApiProperty.User....  User not found
export const UserApiProperty = {
  Id: {
    description: 'The unique user ID',
    example: '658170cbb954e9f5b905ccf4'
  },
  Email: {
    description: 'The unique user email',
    example: 'user@local.ru'
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
  AccessToken: {
    description: 'The user access JWT token',
    example: 'asdasdsdfetyhetyhythgfnghnlkcsdkfajowfjlsdkmcv'
  },
  RefreshToken: {
    description: 'The user refresh JWT token',
    example: 'fvdfvbdgbsdfbfgbfgfghdr6he5656hsrthsfhfg'
  }
} as const;
