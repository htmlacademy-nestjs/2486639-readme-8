import { Entity, PostType, PostData, Post, StorableEntity } from '@project/shared/core';
import { BlogUserEntity } from '@project/account/blog-user';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: string[];
  public user: BlogUserEntity;
  public data: PostData;

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      tags: this.tags,
      user: this.user,
      data: this.data
    }
  }
}
