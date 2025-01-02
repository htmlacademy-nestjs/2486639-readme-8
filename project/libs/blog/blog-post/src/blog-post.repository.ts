import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Post, PostState, PostType } from '@project/shared/core';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        tags: {
          connect: pojoEntity.tags.map(({ id }) => ({ id }))
        }
        //repostedPost:undefined //! тест на время? все эти поля передать параметрами?
        //repostedPost: { connect: { id: '129f97f2-9b77-499a-a740-156c4b881a44' } } //! ошибка вставки
        //repostedPost: undefined
      }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const post = await this.client.post.findFirst({
      where: { id },
      include: { tags: true }
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    //! ошибка на время
    const type = post.type as PostType;
    const state = post.state as PostState;

    return this.createEntityFromDocument({ ...post, type, state });
  }
}
