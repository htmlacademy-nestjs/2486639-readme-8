import { ApiProperty } from "@nestjs/swagger";

import { UserApiProperty } from "../authentication.constant.property";

export class LoginUserDto {
  @ApiProperty(UserApiProperty.Email)
  public email: string;

  @ApiProperty(UserApiProperty.Password)
  public password: string;
}
