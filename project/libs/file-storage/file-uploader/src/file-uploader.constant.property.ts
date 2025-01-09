export const FileApiProperty = {
  Id: {
    description: 'The unique file ID',
    example: '658170cbb954e9f5b905ccf4'
  },
  OriginalName: {
    description: 'The original filename',
    example: 'filename.txt'
  },
  HashName: {
    description: 'The hash filename',
    example: '658170cbb954e9f5b905ccf4.txt'
  },
  SubDirectory: {
    description: 'The file sub directory',
    example: 'password'
  },
  Mimetype: {
    description: 'The file mimetype',
    example: 'plain/text'
  },
  Size: {
    description: 'The file size',
    example: '500'
  }
} as const;
