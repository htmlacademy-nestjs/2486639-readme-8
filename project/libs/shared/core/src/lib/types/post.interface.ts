import { PostType } from './post-type.enum';
import { User } from './user.interface';

interface BasePost {
  id?: string;
  type: PostType;
  tags?: string[];
  user?: User;
}

export interface VideoPost extends BasePost {
  title: string;
  url: string;
}

export interface TextPost extends BasePost {
  title: string;
  previewText: string;
  text: string;
}

export interface QuotePost extends BasePost {
  quote: string;
  author: string;
}

export interface PhotoPost extends BasePost {
  imagePath: string;
}

export interface LinkPost extends BasePost {
  url: string;
  text?: string;
}

export type Post = VideoPost | TextPost | QuotePost | PhotoPost | LinkPost;
