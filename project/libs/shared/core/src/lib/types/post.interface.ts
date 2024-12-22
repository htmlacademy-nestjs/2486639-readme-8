import { PostData } from './post-data.interface';
import { PostType } from './post-type.enum';
import { User } from './user.interface';

export interface Post {
  id?: string;
  type: PostType;
  tags?: string[];
  user?: User;
  data: PostData;
}
