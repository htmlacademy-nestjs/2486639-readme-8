import { Injectable } from '@nestjs/common';

import { EntityFactory, Comment } from '@project/shared/core';
import { BlogCommentEntity } from './blog-comment.entity';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogCommentEntity> {
  public create(entityPlainData: Comment): BlogCommentEntity {
    return new BlogCommentEntity(entityPlainData);
  }
}
