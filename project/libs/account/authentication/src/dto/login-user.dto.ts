import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

import { UserApiProperty } from "../authentication.constant.property";
import { AuthenticationValidateMessage, UserValidation } from "../authentication.constant";

export class LoginUserDto {
  @ApiProperty(UserApiProperty.Email)
  @IsEmail({}, AuthenticationValidateMessage.email.invalidFormat)
  public email: string;

  @ApiProperty(UserApiProperty.Password)
  @IsString()
  @MinLength(UserValidation.password.minLength, AuthenticationValidateMessage.password.minLength)
  @MaxLength(UserValidation.password.maxLength, AuthenticationValidateMessage.password.maxLength)
  public password: string;
}
