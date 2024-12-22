import { Module } from '@nestjs/common';

import { BlogPostController } from './blog-post.controller';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogPostRepository, BlogPostFactory]
})
export class BlogPostModule { }
