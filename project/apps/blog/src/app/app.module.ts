import { Module } from '@nestjs/common';

import { BlogPostModule } from '@project/blog/blog-post'
import { BlogPostCommentModule } from '@project/blog/blog-post-comment';
import { BlogPostLikeModule } from '@project/blog/blog-post-like';

@Module({
  imports: [
    BlogPostModule,
    BlogPostCommentModule,
    BlogPostLikeModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
