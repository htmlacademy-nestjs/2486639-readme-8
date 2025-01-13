import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserApiProperty } from '../authentication.constant.property';

export class UserTokenRdo {
  @ApiProperty(UserApiProperty.AccessToken)
  @Expose()
  public accessToken: string;

  @ApiProperty(UserApiProperty.RefreshToken)
  @Expose()
  public refreshToken: string;
}
