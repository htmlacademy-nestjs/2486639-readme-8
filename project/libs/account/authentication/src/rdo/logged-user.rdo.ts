import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserApiProperty } from '../authentication.constant.property';

export class LoggedUserRdo {
  @ApiProperty(UserApiProperty.Id)
  @Expose()
  public id: string;

  @ApiProperty(UserApiProperty.Email)
  @Expose()
  public email: string;

  @ApiProperty(UserApiProperty.AccessToken)
  @Expose()
  public accessToken: string;

  @ApiProperty(UserApiProperty.RefreshToken)
  @Expose()
  public refreshToken: string;
}
