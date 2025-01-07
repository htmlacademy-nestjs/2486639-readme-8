// дополнительный файл с константами, т.к. были ошибки при сборке webpack, ругался AuthenticationApiProperty.User....  User not found
export const FileApiProperty = {
  Id: {
    description: 'The uniq user ID',
    example: '658170cbb954e9f5b905ccf4'
  },
  OriginalName: {
    description: 'The uniq user email',
    example: 'user@local.ru'
  },
  HashName: {
    description: 'The user name',
    example: 'Name'
  },
  SubDirectory: {
    description: 'The user password',
    example: 'password'
  },
  Mimetype: {
    description: 'The file mimetype',
    example: 'plain/text'
  },
  Size: {
    description: 'The user access JWT token',
    example: '500'
  }
} as const;
