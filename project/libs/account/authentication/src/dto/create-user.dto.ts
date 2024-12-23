import { ApiProperty } from "@nestjs/swagger";

import { UserApiProperty } from "../authentication.constant.property";

export class CreateUserDto {
  @ApiProperty(UserApiProperty.Email)
  public email: string;

  @ApiProperty(UserApiProperty.Login)
  public login: string;

  @ApiProperty(UserApiProperty.Password)
  public password: string;
}
