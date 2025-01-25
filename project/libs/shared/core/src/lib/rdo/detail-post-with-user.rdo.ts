import { Expose } from 'class-transformer';

import { DetailPostRdo } from './detail-post.rdo';
import { UserRdo } from './user.rdo';

export class DetailPostWithUserRdo extends DetailPostRdo {
  //@ApiProperty(ApiPropertyOption.DetailUser) //! а нужно?
  @Expose()
  public user: UserRdo;
}
