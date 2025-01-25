import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PostQueryApiProperty } from '../blog-post.constant';

export class TitleQuery {
  @ApiProperty(PostQueryApiProperty.Title)
  @IsString()
  public title: string;
}
