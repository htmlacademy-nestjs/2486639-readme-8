import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { ApiPropertyOption } from '@project/shared/core';

import { UserValidation } from '../authentication.constant';

export class ChangePasswordDto {
  @ApiProperty(ApiPropertyOption.User.OldPassword)
  @IsString()
  public oldPassword: string;

  @ApiProperty(ApiPropertyOption.User.NewPassword)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public newPassword: string;
}
