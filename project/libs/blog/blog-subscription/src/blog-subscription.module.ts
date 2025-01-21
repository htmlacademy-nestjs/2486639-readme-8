import { Module } from '@nestjs/common';

import { BlogSubscriptionController } from './blog-subscription.controller';
import { BlogSubscriptionFactory } from './blog-subscription.factory';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionService } from './blog-subscription.service';

@Module({
  controllers: [BlogSubscriptionController],
  providers: [
    BlogSubscriptionService,
    BlogSubscriptionRepository,
    BlogSubscriptionFactory
  ],
  exports: [BlogSubscriptionService]
})
export class BlogSubscriptionModule { }
