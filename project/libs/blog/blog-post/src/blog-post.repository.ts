import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { PaginationResult, Post, PostState, PostType, SortDirection, SortType, Tag } from '@project/shared/core';

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

  private getTypeAndState({ type, state }): { type: PostType, state: PostState } {
    return { type: type as PostType, state: state as PostState };
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

    const repostedPost: Post = (record.repostedPost)
      ? {
        ...record.repostedPost,
        ...this.getTypeAndState(record.repostedPost),
        tags: []
      }
      : undefined;

    const post: Post = {
      ...record,
      ...this.getTypeAndState(record),
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
      //, include: { repostedPost: true } //! возможно нужно при репосте
    });

    entity.id = record.id;
    entity.publishDate = record.publishDate;
    entity.likesCount = record.likesCount;
    entity.commentsCount = record.commentsCount; //! возможно нужны еще данные...
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
    const take = Default.POST_COUNT;
    const skip = (currentPage - 1) * take;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.showDraft) {
      where.state = PostState.Draft;
    } else {
      where.state = PostState.Published;
    }

    if (query.tag) {
      const title = query.tag.toLocaleLowerCase();
      const { id: tagId } = await this.client.tag.findFirst({ where: { title } });

      where.tags = {
        some: { id: tagId }
      };
    }

    switch (query.sortType) {
      case SortType.Date:
        orderBy.publishDate = SortDirection.Desc;
        break;
      case SortType.Comments:
        orderBy.commentsCount = SortDirection.Desc;
        break;
      case SortType.Likes:
        orderBy.likesCount = SortDirection.Desc;
        break;
    }

    const [records, postCount] = await Promise.all(
      [
        this.client.post.findMany({ where, orderBy, skip, take, include: { tags: true } }),
        this.getPostCount(where)
      ]
    );
    const entities = records.map(
      (record) => {
        const post: Post = {
          ...record,
          ...this.getTypeAndState(record)
        };

        return this.createEntityFromDocument(post);
      }
    );

    return {
      entities,
      currentPage,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount
    }
  }
}
