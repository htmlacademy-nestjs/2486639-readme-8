import { Entity, StorableEntity, Like } from '@project/shared/core';

export class BlogPostLikeEntity extends Entity implements StorableEntity<Like> {
  public postId: string;
  public userId: string;
  public createdAt: Date;

  constructor(like?: Like) {
    super();

    this.populate(like);
  }

  public populate(like?: Like): void {
    if (!like) {
      return;
    }

    this.id = like.id ?? undefined;
    this.postId = like.postId;
    this.userId = like.userId;
    this.createdAt = like.createdAt ?? undefined;
  }

  public toPOJO(): Like {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt
    }
  }
}
