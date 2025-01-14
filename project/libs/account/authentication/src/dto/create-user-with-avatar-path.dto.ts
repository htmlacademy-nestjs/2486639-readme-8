import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { UserApiProperty } from '../authentication.constant.property';

export class CreateUserWithAvatarPathDto extends CreateUserDto {
  @ApiProperty(UserApiProperty.AvatarPath)
  @IsString()
  public avatarPath: string;
}
