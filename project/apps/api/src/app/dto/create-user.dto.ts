import { ApiProperty } from '@nestjs/swagger';

import { CreateUserWithoutAvatarPathDto } from '@project/account/authentication';

import { AvatarFileApiProperty } from '../app.const';

export class CreateUserDto extends CreateUserWithoutAvatarPathDto {
  @ApiProperty(AvatarFileApiProperty)
  public avatarFile: Express.Multer.File;
}
