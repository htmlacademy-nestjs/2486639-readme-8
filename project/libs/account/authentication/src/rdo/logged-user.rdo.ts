import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class LoggedUserRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.User.Email)
  @Expose()
  public email: string;

  @ApiProperty(ApiPropertyOption.User.AccessToken)
  @Expose()
  public accessToken: string;

  @ApiProperty(ApiPropertyOption.User.RefreshToken)
  @Expose()
  public refreshToken: string;
}
