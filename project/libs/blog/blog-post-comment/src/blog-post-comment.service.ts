import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@project/shared/core';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  public async getComments(postId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, query);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, userId: string): Promise<BlogPostCommentEntity> {
    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId });

    await this.blogPostCommentRepository.save(commentEntity);

    return commentEntity;
  }

  public async deleteComment(postId: string, userId: string) {
    await this.blogPostCommentRepository.delete(postId, userId);
  }
}
