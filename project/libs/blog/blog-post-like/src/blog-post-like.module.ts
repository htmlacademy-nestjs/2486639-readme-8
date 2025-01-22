import { Module } from '@nestjs/common';

import { PrismaClientModule } from '@project/blog/models';
import { BlogPostModule } from '@project/blog/blog-post';

import { BlogPostLikeController } from './blog-post-like.controller';
import { BlogPostLikeFactory } from './blog-post-like.factory';
import { BlogPostLikeRepository } from './blog-post-like.repository';
import { BlogPostLikeService } from './blog-post-like.service';

@Module({
  imports: [
    PrismaClientModule,
    BlogPostModule
  ],
  controllers: [BlogPostLikeController],
  providers: [
    BlogPostLikeService,
    BlogPostLikeRepository,
    BlogPostLikeFactory
  ]
})
export class BlogPostLikeModule { }
