import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { PaginationResult, Post, PostState, PostType, Tag } from '@project/shared/core';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostQuery } from './blog-post.query';
import { Default } from './blog-post.constant';

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

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
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
    const publishDate = new Date(pojoEntity.publishDate);

    await this.client.post.update({
      where: { id },
      data: {
        ...pojoEntity,
        tags,
        publishDate,
        repostedPost: undefined // при обновлении не меняем данные о репосте
      }
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } })
  }

  public async find(query: BlogPostQuery): Promise<PaginationResult<BlogPostEntity>> {
    const currentPage = query.page;
    const skip = (currentPage - 1) * Default.POST_COUNT;
    const take = Default.POST_COUNT;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    /*
    query
      public userId?: string;
      public sortType: SortType = Default.SORT_TYPE;
      public type?: PostType;
      public isDraft?: boolean;
      public tag?: string;
     */
    /*
    if (query?.categories) {
      where.categories = {
        some: {
          id: {
            in: query.categories
          }
        }
      }
    }

    if (query?.sortDirection) {
      orderBy.createdAt = query.sortDirection;
    }
    */

    const [records, postCount] = await Promise.all(
      [
        this.client.post.findMany({ where, orderBy, skip, take, include: { tags: true } }),
        this.getPostCount(where)
      ]
    );

    return {
      entities: records.map(
        (record) => {
          //! есть похожий код, при преобразовании созданного поста, подумать как объеденить, но тивы Primsa сложные...
          const post: Post = { ...record, type: record.type as PostType, state: record.state as PostState };

          return this.createEntityFromDocument(post);
        }),
      currentPage,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount
    }
  }
}
