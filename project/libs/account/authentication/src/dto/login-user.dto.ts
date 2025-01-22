import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiPropertyOption } from '@project/shared/core';

import { UserValidation } from '../authentication.constant';

export class LoginUserDto {
  @ApiProperty(ApiPropertyOption.User.Email)
  @IsEmail({})
  public email: string;

  @ApiProperty(ApiPropertyOption.User.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;
}
