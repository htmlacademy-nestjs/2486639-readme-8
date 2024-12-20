import { PostType } from './post-type.enum';

export interface Post {
  id?: string;
  type: PostType;
  tags: string[];
}
