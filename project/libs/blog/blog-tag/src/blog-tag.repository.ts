import { Injectable, NotFoundException } from '@nestjs/common';

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

  public async findById(id: string): Promise<BlogTagEntity> {
    const tag = await this.client.tag.findFirst({
      where: { id }
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found.`);
    }

    return this.createEntityFromDocument(tag);
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    const tag = await this.client.tag.findFirst({
      where: { title }
    });

    if (!tag) {
      throw new NotFoundException(`Tag with title "${title}" not found.`);
    }

    return new BlogTagEntity(tag);
  }
}
