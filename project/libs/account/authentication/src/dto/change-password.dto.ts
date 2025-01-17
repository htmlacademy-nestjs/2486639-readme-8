import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { UserApiProperty } from '../authentication.constant.property';
import { UserValidation } from '../authentication.constant';

export class ChangePasswordDto {
  @ApiProperty(UserApiProperty.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;
}
