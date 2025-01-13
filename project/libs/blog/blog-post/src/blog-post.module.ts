import { Module } from '@nestjs/common';

import { BlogTagModule } from '@project/blog/blog-tag';

import { BlogPostController } from './blog-post.controller';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';

@Module({
  imports: [BlogTagModule],
  controllers: [BlogPostController],
  providers: [
    BlogPostService,
    BlogPostRepository,
    BlogPostFactory
  ],
  exports: [BlogPostService]
})
export class BlogPostModule { }
