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
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    const tag = await this.client.tag.findFirst({
      where: { title }
    });

    return new BlogTagEntity(tag);
  }

  public async findByTitles(titles: string[]): Promise<BlogTagEntity[] | null> {
    const tags = await this.client.tag.findMany({
      where: { title: { in: titles } }
    });

    return tags.map((tag) => new BlogTagEntity(tag));
  }

  public async save(entity: BlogTagEntity): Promise<void> {
    const record = await this.client.tag.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }
}
