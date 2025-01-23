import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Comment, PaginationResult, SortDirection } from '@project/shared/core';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentFactory } from './blog-post-comment.factory';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { BlogPostCommentMessage, Default } from './blog-post-comment.constant';

@Injectable()
export class BlogPostCommentRepository extends BasePostgresRepository<BlogPostCommentEntity, Comment> {
  constructor(
    entityFactory: BlogPostCommentFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private async getCommentCount(where: Prisma.CommentWhereInput): Promise<number> {
    return this.client.comment.count({ where });
  }

  private calculateCommentsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async existsComment(postId: string, userId: string): Promise<boolean> {
    const count = await this.client.comment.count({ where: { postId, userId } });

    return count > 0;
  }

  public async findByPostId(postId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    const currentPage = query.page;
    const take = Default.COMMENT_COUNT;
    const skip = (currentPage - 1) * take;
    const where: Prisma.CommentWhereInput = {};
    const orderBy: Prisma.CommentOrderByWithRelationInput = {};

    where.postId = postId;
    orderBy.createdAt = SortDirection.Desc;

    const [records, commentCount] = await Promise.all(
      [
        this.client.comment.findMany({ where, orderBy, skip, take }),
        this.getCommentCount(where)
      ]
    );
    const entities = records.map(
      (record) => this.createEntityFromDocument(record)
    );

    return {
      entities,
      currentPage,
      totalPages: this.calculateCommentsPage(commentCount, take),
      itemsPerPage: take,
      totalItems: commentCount
    }
  }

  public async save(entity: BlogPostCommentEntity): Promise<void> {
    const record = await this.client.comment.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
    entity.createdAt = record.createdAt;
  }

  public async findById(id: string): Promise<BlogPostCommentEntity> {
    const record = await this.client.comment.findFirst({ where: { id } });

    if (!record) {
      throw new NotFoundException(BlogPostCommentMessage.CommentNotFound);
    }

    return this.createEntityFromDocument(record);
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({ where: { id } });
  }
}
