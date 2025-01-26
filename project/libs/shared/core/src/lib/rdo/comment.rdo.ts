import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApiPropertyOption } from '../constants/api-property-option';

export class CommentRdo {
  @ApiProperty(ApiPropertyOption.Comment.Id)
  @Expose()
  public id: string;

  @ApiProperty(ApiPropertyOption.Comment.Message)
  @Expose()
  public message: string;

  @ApiProperty(ApiPropertyOption.Comment.CreatedAt)
  @Expose()
  public createdAt: Date;
}
