//import { ApiProperty } from '@nestjs/swagger';

//import { PostCommentApiProperty } from '../blog-post-comment.constant.property';

export class CreatePostCommentDto {
  //@ApiProperty(PostApiProperty.Type)
  //public type: PostType;

  public message: string;
}
