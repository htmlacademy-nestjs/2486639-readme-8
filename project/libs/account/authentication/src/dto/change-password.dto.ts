import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { ApiPropertyOption } from '@project/shared/core';

import { UserValidation } from '../authentication.constant';

export class ChangePasswordDto {
  @ApiProperty(ApiPropertyOption.User.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;
}
