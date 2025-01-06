import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Comment, PaginationResult } from '@project/shared/core';
import { getMetaError } from '@project/shared/helpers';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentFactory } from './blog-post-comment.factory';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { BlogPostCommentMessage, Default } from './blog-post-comment.constant';
import { Prisma } from '@prisma/client';

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
    try {
      const record = await this.client.comment.create({
        data: { ...entity.toPOJO() }
      });

      entity.id = record.id;
    } catch (error) {
      //! как правильно обработать? где взять описание ключей, индексов и т.д.
      const { code, message, fieldName } = getMetaError(error);

      //! при ошибке, что нет поста { modelName: 'Comment', field_name: 'comments_post_id_fkey (index)' }
      if (fieldName === 'comments_post_id_fkey (index)') {
        throw new NotFoundException(`${BlogPostCommentMessage.PostNotFound} postId: ${entity.postId}`);
      }

      //! при ошибке, что пользователь уже комментировал этот пост
      //Unique constraint failed on the (not available)
      //code: 'P2002',
      //meta: { modelName: 'Comment', target: null }
      if ((code === 'P2002') && (message.indexOf('Unique constraint failed on the (not available)'))) {
        throw new ConflictException(`${BlogPostCommentMessage.CommentExist} postId: ${entity.postId}`);
      }

      Logger.log(`Error in BlogPostCommentRepository.save postId: ${entity.postId}, userId: ${entity.userId}`);
      Logger.log(error);
      throw new BadRequestException('Bad request');
    }
  }

  public async delete(postId: string, userId: string): Promise<void> {
    const comment = await this.client.comment.findFirst({
      where: { postId, userId }
    });

    if (!comment) {
      throw new NotFoundException(`Your comment for post not found. postId: ${postId}`);
      //! а еще возможно, что автор только что удалил пост
    }

    await this.client.comment.delete({ where: { id: comment.id } })
  }
}
