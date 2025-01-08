import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { UserApiProperty } from '../authentication.constant.property';
import { UserValidation } from '../authentication.constant';

export class LoginUserDto {
  @ApiProperty(UserApiProperty.Email)
  @IsEmail({})
  public email: string;

  @ApiProperty(UserApiProperty.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;
}
