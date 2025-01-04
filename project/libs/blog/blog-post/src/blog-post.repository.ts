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

  private getTagIds(tags: Tag[]): { id: string }[] {
    return tags.map(({ id }) => ({ id }));
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const record = await this.client.post.findFirst(
      {
        where: { id },
        include: {
          tags: true,
          repostedPost: true
        }
      }
    );

    if (!record) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    //! вынести в функцию
    const repostedPost: Post = (record.repostedPost)
      ? {
        ...record.repostedPost,
        type: record.repostedPost.type as PostType,
        state: record.repostedPost.state as PostState,
        tags: []
      }
      : undefined;

    const post: Post = {
      ...record,
      type: record.type as PostType,
      state: record.state as PostState,
      repostedPost
    };

    return this.createEntityFromDocument(post);
  }

  public async save(entity: BlogPostEntity): Promise<void> {
    const pojoEntity = entity.toPOJO();
    const tags = { connect: this.getTagIds(pojoEntity.tags) };
    const repostedPost = (pojoEntity.repostedPost)
      ? { connect: { id: pojoEntity.repostedPost.id } }
      : undefined;
    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        tags,
        repostedPost
      }
      //! , include: { repostedPost: true } //! возможно нужно при репосте
    });

    entity.id = record.id;
    entity.publishDate = record.publishDate;
    entity.likesCount = record.likesCount;
    entity.commentsCount = record.commentsCount;//! возможно нужны еще данные...
  }

  public async update(entity: BlogPostEntity): Promise<void> {
    const { id } = entity;
    const pojoEntity = entity.toPOJO();
    const tags = { set: this.getTagIds(pojoEntity.tags) }

    await this.client.post.update({
      where: { id },
      data: {
        ...pojoEntity,
        tags,
        repostedPost: undefined // при обновлении не меняем данные о репосте
      }
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } })
  }
}
