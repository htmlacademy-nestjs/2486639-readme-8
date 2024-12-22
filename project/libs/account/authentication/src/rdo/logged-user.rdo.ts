import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { AuthenticationApiProperty } from '../authentication.constant.property';

export class LoggedUserRdo {
  @ApiProperty(AuthenticationApiProperty.User.Id)
  @Expose()
  public id: string;

  @ApiProperty(AuthenticationApiProperty.User.Email)
  @Expose()
  public email: string;

  @ApiProperty(AuthenticationApiProperty.User.AccessToken)
  @Expose()
  public accessToken: string;
}
