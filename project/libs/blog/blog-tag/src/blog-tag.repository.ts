import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@project/shared/data-access';

import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagFactory } from './blog-tag.factory';

@Injectable()
export class BlogTagRepository extends BaseMemoryRepository<BlogTagEntity> {
  constructor(entityFactory: BlogTagFactory) {
    super(entityFactory);
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    const document = this.entities.get(title);

    return new BlogTagEntity(document);
  }
}
