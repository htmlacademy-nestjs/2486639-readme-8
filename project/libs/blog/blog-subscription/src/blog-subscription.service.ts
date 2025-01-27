import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { BlogSubscriptionEntity } from './blog-subscription.entity';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionMessage } from './blog-subscription.constant';

@Injectable()
export class BlogSubscriptionService {
  constructor(
    private readonly blogSubscriptionRepository: BlogSubscriptionRepository
  ) { }

  private checkAuthorization(userId: string): void {
    if (!userId) {
      throw new UnauthorizedException(BlogSubscriptionMessage.Unauthorized);
    }
  }

  public async subscribe(authorUserId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);

    const foundLikeId = await this.blogSubscriptionRepository.findSubscriptionId(authorUserId, userId);

    if (foundLikeId) {
      throw new ConflictException(!BlogSubscriptionMessage.SubscriptionExist);
    }

    const likeEntity = new BlogSubscriptionEntity({ authorUserId, userId: userId });

    await this.blogSubscriptionRepository.save(likeEntity);
  }

  public async unsubscribe(authorUserId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);

    const foundLikeId = await this.blogSubscriptionRepository.findSubscriptionId(authorUserId, userId);

    if (!foundLikeId) {
      throw new NotFoundException(BlogSubscriptionMessage.SubscriptionNotFound);
    }

    await this.blogSubscriptionRepository.deleteById(foundLikeId);
  }

  public async getUserSubscriptionsCount(userId: string): Promise<number> {
    const subscriptionsCount = await this.blogSubscriptionRepository.getUserSubscriptionsCount(userId);

    return subscriptionsCount;
  }

  public async getUserSubscriptions(userId: string): Promise<string[]> {
    const subscriptions = await this.blogSubscriptionRepository.getUserSubscriptions(userId);

    return subscriptions;
  }
}
