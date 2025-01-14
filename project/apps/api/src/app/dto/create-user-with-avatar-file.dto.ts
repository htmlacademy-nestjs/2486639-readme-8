import { ApiProperty } from '@nestjs/swagger';
import 'multer';
import { Express } from 'express';

import { CreateUserDto } from '@project/account/authentication';

const SIZE = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];

export class CreateUserWithAvatarFileDto extends CreateUserDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary'
  })
  public avatarFile: Express.Multer.File;
}
