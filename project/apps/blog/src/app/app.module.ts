import { Module } from '@nestjs/common';

import { BlogConfigModule } from '@project/blog/config';
import { BlogPostModule } from '@project/blog/blog-post'
import { BlogPostCommentModule } from '@project/blog/blog-post-comment';
import { BlogPostLikeModule } from '@project/blog/blog-post-like';
import { BlogSubscriptionModule } from '@project/blog/blog-subscription';
import { NewsLetterModule } from '@project/blog/news-letter';

@Module({
  imports: [
    BlogConfigModule,
    BlogPostModule,
    BlogPostCommentModule,
    BlogPostLikeModule,
    BlogSubscriptionModule,
    NewsLetterModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
