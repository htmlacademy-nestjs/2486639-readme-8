import { Injectable } from '@nestjs/common';

import { EntityFactory, Comment } from '@project/shared/core';
import { BlogPostCommentEntity } from './blog-post-comment.entity';

@Injectable()
export class BlogPostCommentFactory implements EntityFactory<BlogPostCommentEntity> {
  public create(entityPlainData: Comment): BlogPostCommentEntity {
    return new BlogPostCommentEntity(entityPlainData);
  }
}
