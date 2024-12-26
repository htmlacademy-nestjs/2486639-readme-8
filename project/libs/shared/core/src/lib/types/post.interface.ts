import { PostState } from './post-state.enum';
import { PostType } from './post-type.enum';
import { Tag } from './tag.interface';
import { User } from './user.interface';

export interface Post {
  id?: string;
  type: PostType;
  tags?: Tag[];
  publishDate?: Date;
  repostedPost?: Post;
  state?: PostState;
  user?: User;
  title?: string;          // types: video, text
  url?: string;            // types: video, url
  previewText?: string;    // types: text
  text?: string;           // types: text
  quoteText?: string;      // types: quote
  quoteAuthor?: string;    // types: quote
  imagePath?: string;      // types: photo
  urlDescription?: string; // types: url
}
