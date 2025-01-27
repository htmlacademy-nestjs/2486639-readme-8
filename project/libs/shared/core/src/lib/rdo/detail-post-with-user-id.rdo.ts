import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { DetailPostRdo } from './detail-post.rdo';

import { ApiPropertyOption } from '../constants/api-property-option';

export class DetailPostWithUserIdRdo extends DetailPostRdo {
  @ApiProperty(ApiPropertyOption.User.Id)
  @Expose()
  public userId: string;
}
