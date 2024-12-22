import { ApiProperty } from "@nestjs/swagger";

import { AuthenticationApiProperty } from "../authentication.constant.property";

export class CreateUserDto {
  @ApiProperty(AuthenticationApiProperty.User.Email)
  public email: string;

  @ApiProperty(AuthenticationApiProperty.User.Login)
  public login: string;

  @ApiProperty(AuthenticationApiProperty.User.Password)
  public password: string;
}
