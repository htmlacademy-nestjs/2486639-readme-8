import { PostState } from './post-state.enum';
import { PostType } from './post-type.enum';
import { Tag } from './tag.interface';

export interface Post {
  id?: string;
  type: PostType;
  tags: Tag[];
  publishDate?: Date;
  repostedPost?: Post;
  state: PostState;
  title?: string;           // types: video, text
  url?: string;             // types: video, link
  previewText?: string;     // types: text
  text?: string;            // types: text
  quoteText?: string;       // types: quote
  quoteAuthor?: string;     // types: quote
  imagePath?: string;       // types: photo
  linkDescription?: string; // types: link
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  likesCount?: number;
  commentsCount?: number;
}
