import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CreateUserWithoutAvatarPathDto } from './create-user-without-avatar-path.dto';
import { UserApiProperty } from '../authentication.constant.property';

export class CreateUserDto extends CreateUserWithoutAvatarPathDto {
  @ApiProperty(UserApiProperty.AvatarPath)
  @IsString()
  @IsOptional()
  public avatarPath?: string;
}
