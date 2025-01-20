import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { BlogSubscriptionEntity } from './blog-subscription.entity';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionMessage } from './blog-subscription.constant';

@Injectable()
export class BlogSubscriptionService {
  constructor(
    private readonly blogSubscriptionRepository: BlogSubscriptionRepository
  ) { }

  private checkAuthorization(currentUserId: string): void {
    if (!currentUserId) {
      throw new UnauthorizedException(BlogSubscriptionMessage.Unauthorized);
    }
  }

  public async subscribe(authorUserId: string, currentUserId: string): Promise<void> {
    this.checkAuthorization(currentUserId);

    const foundLikeId = await this.blogSubscriptionRepository.findSubscriptionId(authorUserId, currentUserId);

    if (foundLikeId) {
      throw new ConflictException(!BlogSubscriptionMessage.SubscriptionExist);
    }

    const likeEntity = new BlogSubscriptionEntity({ authorUserId, userId: currentUserId });

    await this.blogSubscriptionRepository.save(likeEntity);
  }

  public async unsubscribe(authorUserId: string, currentUserId: string): Promise<void> {
    this.checkAuthorization(currentUserId);

    const foundLikeId = await this.blogSubscriptionRepository.findSubscriptionId(authorUserId, currentUserId);

    if (!foundLikeId) {
      throw new NotFoundException();//!BlogSubscriptionMessage.LikeNotFound);
    }

    await this.blogSubscriptionRepository.deleteById(foundLikeId);
  }

  public async getAuthorSubscriptionsCount(authorUserId: string): Promise<number> {
    const postsCount = await this.blogSubscriptionRepository.getAuthorSubscriptionsCount(authorUserId);

    return postsCount;
  }
}
