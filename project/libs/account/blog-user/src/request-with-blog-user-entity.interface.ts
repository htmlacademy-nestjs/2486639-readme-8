import { BlogUserEntity } from './blog-user.entity';

export interface RequestWithBlogUserEntity {
  user?: BlogUserEntity;
}
