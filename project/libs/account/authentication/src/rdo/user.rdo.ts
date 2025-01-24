import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

import { ApiPropertyOption } from '@project/shared/core';

import { ONLY_DATE_FORMAT } from '../authentication.constant';

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
  @Transform(({ value }) => dayjs(value).format(ONLY_DATE_FORMAT))
  @Expose({ name: 'createdAt' })
  public registrationDate: string;
}
