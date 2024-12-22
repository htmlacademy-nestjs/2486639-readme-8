import { Entity, PostType, PostData, Post, StorableEntity } from '@project/shared/core';
import { BlogUserEntity } from '@project/account/blog-user';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: string[];
  public user: BlogUserEntity;
  public data: PostData;

  constructor(post?: Post) {
    super();

    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? '';
    this.type = post.type;
    this.tags = [...post.tags];
    this.data = { ...post.data };
  }

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
