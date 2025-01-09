import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Comment, PaginationResult } from '@project/shared/core';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentFactory } from './blog-post-comment.factory';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { Default } from './blog-post-comment.constant';

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

  public async findCommentId(postId: string, userId: string): Promise<string> {
    const record = await this.client.comment.findFirst({
      select: { id: true },
      where: { postId, userId }
    });

    return record?.id;
  }

  public async findByPostId(postId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    const currentPage = query.page;
    const take = Default.COMMENT_COUNT;
    const skip = (currentPage - 1) * take;
    const where: Prisma.CommentWhereInput = {};

    where.postId = postId;

    const [records, commentCount] = await Promise.all(
      [
        this.client.comment.findMany({ where, skip, take }),
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
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({ where: { id } })
  }
}
