// дополнительный файл с константами, т.к. были ошибки при сборке webpack, ругался AuthenticationApiProperty.User....  User not found
export const UserApiProperty = {
  Id: {
    description: 'The uniq user ID',
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
  },
  Email: {
    description: 'The uniq user email',
    example: 'user@local.ru'
  },
  Login: {
    description: 'The user login',
    example: 'login'
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
  }
} as const;
