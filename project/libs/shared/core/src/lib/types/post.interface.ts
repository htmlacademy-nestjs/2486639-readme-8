import { PostState } from './post-state.enum';
import { PostType } from './post-type.enum';
import { Tag } from './tag.interface';
import { User } from './user.interface';

export interface Post {
  id?: string;
  type: PostType;
  publishDate: Date;
  isRepost: boolean;
  tags?: Tag[];
  state: PostState;
  user?: User;
  url: string;
  previewText: string;
  text: string;
  quoteText: string;
  quoteAuthor: string;
  imagePath: string;
  urlDescription: string;
}
