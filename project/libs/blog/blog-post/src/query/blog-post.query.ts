import { BaseBlogPostQuery } from './base-blog-post.query';

export class BlogPostQuery extends BaseBlogPostQuery {
  public userIds?: string[];
}
