import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PrismaClientModule } from '@project/blog/models';

import { BlogConfigModule, getMongooseOptions } from '@project/blog/config';
import { BlogPostModule } from '@project/blog/blog-post'
import { BlogPostCommentModule } from '@project/blog/blog-post-comment';
import { BlogPostLikeModule } from '@project/blog/blog-post-like';
import { BlogSubscriptionModule } from '@project/blog/blog-subscription';

@Module({
  imports: [
    PrismaClientModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()),
    BlogConfigModule,
    BlogPostModule,
    BlogPostCommentModule,
    BlogPostLikeModule,
    BlogSubscriptionModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
