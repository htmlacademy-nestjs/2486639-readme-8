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
        },
        //repostedPost: { connect: { id: pojoEntity.repostedPost.id } } //! ошибка вставки
        repostedPost: undefined
      }
    });

    entity.id = record.id;
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const post = await this.client.post.findFirst({
      where: { id },
      include: {
        tags: true,
        repostedPost: true
      }
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    const repostedPost: Post = (!post.repostedPost)
      ? undefined
      : {
        ...post.repostedPost,
        type: post.repostedPost.type as PostType,
        state: post.repostedPost.state as PostState,
        tags: []
      };

    return this.createEntityFromDocument({
      ...post,
      type: post.type as PostType,
      state: post.state as PostState,
      repostedPost
    });
  }
}
