import { Module } from '@nestjs/common';

import { BlogPostModule } from '@project/blog/blog-post'
import { BlogPostCommentModule } from '@project/blog/blog-post-comment';

@Module({
  imports: [
    BlogPostModule,
    BlogPostCommentModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
