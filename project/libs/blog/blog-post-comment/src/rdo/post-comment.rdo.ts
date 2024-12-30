//import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

//import { PostApiProperty } from '../blog-post.constant.property';

export class PostCommentRdo {
  //@ApiProperty(PostApiProperty.Id)
  @Expose()
  public id: string;

  //@ApiProperty(PostApiProperty.Type)
  @Expose()
  public message: string;

  //@ApiProperty(PostApiProperty.Tags)
  //! нужно ли
  @Expose()
  public postId: string;

  @Expose()
  public userId: string;

  @Expose()
  public date: Date;
}
