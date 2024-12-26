import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '@project/shared/data-access';
import { PrismaClientService } from '@project/blog/models';
import { Tag } from '@project/shared/core';

import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagFactory } from './blog-tag.factory';

@Injectable()
export class BlogTagRepository extends BasePostgresRepository<BlogTagEntity, Tag> {
  constructor(
    entityFactory: BlogTagFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogTagEntity): Promise<void> {
    const record = await this.client.tag.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    //const document = this.entities.get(title);

    return new BlogTagEntity(document);
  }

  /*
    public async find(filter?: CategoryFilter): Promise<BlogCategoryEntity[]> {
      const where = filter ?? categoryFilterToPrismaFilter(filter);

      const documents = await this.client.category.findMany({
        where,
        take: MAX_CATEGORY_LIMIT
      });


      return documents.map((document) => this.createEntityFromDocument(document));
    }
  */
}
