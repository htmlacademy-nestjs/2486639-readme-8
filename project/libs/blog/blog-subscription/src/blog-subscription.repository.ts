import { Injectable } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Subscription } from '@project/shared/core';

import { BlogSubscriptionEntity } from './blog-subscription.entity';
import { BlogSubscriptionFactory } from './blog-subscription.factory';

@Injectable()
export class BlogSubscriptionRepository extends BasePostgresRepository<BlogSubscriptionEntity, Subscription> {
  constructor(
    entityFactory: BlogSubscriptionFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async findSubscriptionId(authorUserId: string, userId: string): Promise<string> {
    const record = await this.client.subscription.findFirst({
      select: { id: true },
      where: { authorUserId, userId }
    });

    return record?.id;
  }

  public async save(entity: BlogSubscriptionEntity): Promise<void> {
    const record = await this.client.subscription.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.subscription.delete({ where: { id } })
  }

  public async getAuthorSubscriptionsCount(authorUserId: string): Promise<number> {
    const subscriptionsCount = await this.client.subscription.count({ where: { authorUserId } });

    return subscriptionsCount;
  }
}
