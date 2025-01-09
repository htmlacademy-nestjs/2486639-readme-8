import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PaginationResult } from '@project/shared/core';
import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { BlogPostCommentMessage } from './blog-post-comment.constant';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  public async getComments(postId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    await this.blogPostSevice.existsPost(postId);

    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, query);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, userId: string): Promise<BlogPostCommentEntity> {
    await this.blogPostSevice.existsPost(postId);

    const foundCommentId = await this.blogPostCommentRepository.findId(postId, userId);

    if (foundCommentId) {
      throw new ConflictException(BlogPostCommentMessage.CommentExist);
    }

    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId });

    await this.blogPostCommentRepository.save(commentEntity);
    await this.blogPostSevice.incrementCommentsCount(postId);

    return commentEntity;
  }

  public async deleteComment(postId: string, userId: string) {
    await this.blogPostSevice.existsPost(postId);

    const foundCommentId = await this.blogPostCommentRepository.findId(postId, userId);

    if (!foundCommentId) {
      throw new NotFoundException(BlogPostCommentMessage.CommentNotFound);
    }

    await this.blogPostCommentRepository.deleteById(foundCommentId);
    await this.blogPostSevice.decrementCommentsCount(postId);
  }
}
