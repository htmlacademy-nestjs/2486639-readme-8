import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserApiProperty } from '../authentication.constant.property';

export class UserRdo {
  @ApiProperty(UserApiProperty.Id)
  @Expose()
  public id: string;

  @ApiProperty(UserApiProperty.Email)
  @Expose()
  public email: string;

  @ApiProperty(UserApiProperty.Login)
  @Expose()
  public login: string;

  @ApiProperty(UserApiProperty.AvatarPath)
  @Expose()
  public avatarPath: string;
}
