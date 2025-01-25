import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { ApiPropertyOption } from '../constants/api-property-option';
import { transformDate } from '../utils/transform';

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
  @Transform(transformDate)
  @Expose({ name: 'createdAt' })
  public registrationDate: string;
}
