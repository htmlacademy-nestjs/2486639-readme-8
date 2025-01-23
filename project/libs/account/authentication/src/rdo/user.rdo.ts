import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '@project/shared/core';

export class UserRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.User.Email)
  @Expose()
  public email: string;

  @ApiProperty(ApiPropertyOption.User.Name)
  @Expose()
  public name: string;

  @ApiProperty(ApiPropertyOption.User.AvatarPath)
  @Expose()
  public avatarPath: string;
}
