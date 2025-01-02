import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Post, PostState, PostType, Tag } from '@project/shared/core';

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
    console.log(entity.toPOJO()); //! тест !!!!

    const record = await this.client.post.create({
      data: {
        ...entity.toPOJO(),
        tags: undefined,
        //tags: { connect: [] },
        //tags: undefined,
        //repostedPost:undefined, //! тест на время? все эти поля передать параметрами?
        //repostedPost: { connect: { id: '129f97f2-9b77-499a-a740-156c4b881a44' } } //! ошибка вставки
        //repostedPost: undefined,
      }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const post = await this.client.post.findFirst({
      where: { id }
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    //! ошибка на время
    const type = post.type as PostType;
    const state = post.state as PostState;
    const tags: Tag[] = [];

    return this.createEntityFromDocument({ ...post, type, state, tags });
  }
}
