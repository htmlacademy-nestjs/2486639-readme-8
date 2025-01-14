import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from '@project/account/authentication';

import { AvatarFileApiProperty } from '../app.const';

export class CreateUserWithAvatarFileDto extends CreateUserDto {
  @ApiProperty(AvatarFileApiProperty)
  public avatarFile: Express.Multer.File;
}
