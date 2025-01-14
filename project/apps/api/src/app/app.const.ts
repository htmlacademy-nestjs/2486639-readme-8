import { HttpStatus } from "@nestjs/common";

export const Avatar = {
  KEY: 'avatarFile',
  MAX_SIZE: 500 * 1024,
  MIME_TYPES: ['image/jpeg', 'image/png']
} as const;

export const AvatarFileApiProperty = {
  required: false,
  description: 'The avatar file',
  type: 'string',
  format: 'binary'
} as const;

export const AvatarFileValidator = {
  Type: { fileType: Avatar.MIME_TYPES.join('|') },
  MaxSize: { maxSize: Avatar.MAX_SIZE },
  Build: {
    fileIsRequired: AvatarFileApiProperty.required,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }
} as const;
