import { Injectable } from '@nestjs/common';

import { EntityFactory, Like } from '@project/shared/core';

import { BlogPostLikeEntity } from './blog-post-like.entity';

@Injectable()
export class BlogPostLikeFactory implements EntityFactory<BlogPostLikeEntity> {
  public create(entityPlainData: Like): BlogPostLikeEntity {
    return new BlogPostLikeEntity(entityPlainData);
  }
}
