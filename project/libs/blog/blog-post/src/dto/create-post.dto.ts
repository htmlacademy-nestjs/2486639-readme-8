import { ApiProperty } from "@nestjs/swagger";

import { PostData, PostType } from "@project/shared/core";

/*
import { AuthenticationApiProperty } from "../authentication.constant.property";
*/

export class CreatePostDto {
  @ApiProperty({ enum: PostType })
  //@ApiProperty(AuthenticationApiProperty.User.Email)
  public type: PostType;

  public tags: string[];

  public data: PostData;
}
