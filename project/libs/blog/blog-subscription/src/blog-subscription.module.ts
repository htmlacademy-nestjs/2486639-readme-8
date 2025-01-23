import { Module } from '@nestjs/common';

import { PrismaClientModule } from '@project/blog/models';

import { BlogSubscriptionController } from './blog-subscription.controller';
import { BlogSubscriptionFactory } from './blog-subscription.factory';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionService } from './blog-subscription.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [BlogSubscriptionController],
  providers: [
    BlogSubscriptionService,
    BlogSubscriptionRepository,
    BlogSubscriptionFactory
  ],
  exports: [BlogSubscriptionService]
})
export class BlogSubscriptionModule { }
