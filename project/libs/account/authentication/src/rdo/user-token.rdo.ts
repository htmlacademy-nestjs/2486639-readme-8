import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class UserTokenRdo {
  @ApiProperty(ApiPropertyOption.User.AccessToken)
  @Expose()
  public accessToken: string;

  @ApiProperty(ApiPropertyOption.User.RefreshToken)
  @Expose()
  public refreshToken: string;
}
