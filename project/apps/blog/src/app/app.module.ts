import { Module } from '@nestjs/common';

import { BlogPostModule } from '@project/blog/blog-post'
import { BlogPostCommentModule } from '@project/blog/blog-post-comment';
import { BlogPostLikeModule } from '@project/blog/blog-post-like';
import { BlogSubscriptionModule } from '@project/blog/blog-subscription';

@Module({
  imports: [
    BlogPostModule,
    BlogPostCommentModule,
    BlogPostLikeModule,
    BlogSubscriptionModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
