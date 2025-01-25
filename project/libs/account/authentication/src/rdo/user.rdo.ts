import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { ApiPropertyOption, DateFormat } from '@project/shared/core';

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

  @ApiProperty(ApiPropertyOption.User.registrationDate)
  @Transform(({ value }) => dayjs(value).format(DateFormat.ONLY_DATE))
  @Expose({ name: 'createdAt' })
  public registrationDate: string;
}
