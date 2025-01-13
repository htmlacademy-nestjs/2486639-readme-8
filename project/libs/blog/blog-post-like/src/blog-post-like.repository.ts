import { Injectable } from '@nestjs/common';

import { PrismaClientService } from '@project/blog/models';
import { BasePostgresRepository } from '@project/shared/data-access';
import { Like } from '@project/shared/core';

import { BlogPostLikeEntity } from './blog-post-like.entity';
import { BlogPostLikeFactory } from './blog-post-like.factory';

@Injectable()
export class BlogPostLikeRepository extends BasePostgresRepository<BlogPostLikeEntity, Like> {
  constructor(
    entityFactory: BlogPostLikeFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async findLikeId(postId: string, userId: string): Promise<string> {
    const record = await this.client.like.findFirst({
      select: { id: true },
      where: { postId, userId }
    });

    return record?.id;
  }

  public async save(entity: BlogPostLikeEntity): Promise<void> {
    const record = await this.client.like.create({
      data: { ...entity.toPOJO() }
    });

    entity.id = record.id;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.like.delete({ where: { id } })
  }
}
