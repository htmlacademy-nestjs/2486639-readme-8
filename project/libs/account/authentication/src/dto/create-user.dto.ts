import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { UserApiProperty } from '../authentication.constant.property';
import { AuthenticationValidateMessage, UserValidation } from '../authentication.constant';

export class CreateUserDto {
  @ApiProperty(UserApiProperty.Email)
  @IsEmail({}, AuthenticationValidateMessage.Email.InvalidFormat)
  public email: string;

  @ApiProperty(UserApiProperty.Name)
  @IsString()
  @MinLength(UserValidation.Name.MinLength, AuthenticationValidateMessage.Name.MinLength)
  @MaxLength(UserValidation.Name.MaxLength, AuthenticationValidateMessage.Name.MaxLength)
  public name: string;

  @ApiProperty(UserApiProperty.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength, AuthenticationValidateMessage.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength, AuthenticationValidateMessage.Password.MaxLength)
  public password: string;
}
