import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Comment } from '@project/shared/core';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentFactory } from './blog-post-comment.factory';

@Injectable()
export class BlogPostCommentRepository extends BasePostgresRepository<BlogPostCommentEntity, Comment> {
  constructor(
    entityFactory: BlogPostCommentFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async findByPostId(postId: string): Promise<BlogPostCommentEntity[]> {
    const records = await this.client.comment.findMany({
      where: { postId }
    });

    return records.map((record) => this.createEntityFromDocument(record));
  }

  public async save(entity: BlogPostCommentEntity): Promise<void> {
    const record = await this.client.comment.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async delete(postId: string, userId: string): Promise<void> {
    const comment = await this.client.comment.findFirst({
      where: { postId, userId }
    });

    if (!comment) {
      throw new NotFoundException(`Comment for postId ${postId} and userId ${userId} not found.`);
    }

    await this.client.comment.delete({ where: { id: comment.id } })
  }
}
