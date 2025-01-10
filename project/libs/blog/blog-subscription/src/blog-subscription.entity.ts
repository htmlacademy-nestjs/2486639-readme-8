import { Entity, StorableEntity, Subscription } from '@project/shared/core';

export class BlogSubscriptionEntity extends Entity implements StorableEntity<Subscription> {
  public authorUserId: string;
  public userId: string;
  public createdAt: Date;

  constructor(subscription?: Subscription) {
    super();

    this.populate(subscription);
  }

  public populate(subscription?: Subscription): void {
    if (!subscription) {
      return;
    }

    this.id = subscription.id ?? undefined;
    this.authorUserId = subscription.authorUserId;
    this.userId = subscription.userId;
    this.createdAt = subscription.createdAt ?? undefined;
  }

  public toPOJO(): Subscription {
    return {
      id: this.id,
      authorUserId: this.authorUserId,
      userId: this.userId,
      createdAt: this.createdAt
    }
  }
}
