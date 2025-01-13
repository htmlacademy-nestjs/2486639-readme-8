import { Injectable } from '@nestjs/common';

import { EntityFactory, Subscription } from '@project/shared/core';

import { BlogSubscriptionEntity } from './blog-subscription.entity';

@Injectable()
export class BlogSubscriptionFactory implements EntityFactory<BlogSubscriptionEntity> {
  public create(entityPlainData: Subscription): BlogSubscriptionEntity {
    return new BlogSubscriptionEntity(entityPlainData);
  }
}
