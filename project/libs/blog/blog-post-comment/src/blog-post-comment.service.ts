import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

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

  private checkAuthorization(currentUserId: string): void {
    if (!currentUserId) {
      throw new UnauthorizedException(BlogPostCommentMessage.Unauthorized);
    }
  }

  private async canViewPost(postId: string, currentUserId: string): Promise<void> {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canViewPost(foundPost, currentUserId);
  }

  private async canCommentPost(postId: string): Promise<void> {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canCommentPost(foundPost);
  }

  public async getComments(postId: string, currentUserId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    await this.canViewPost(postId, currentUserId);

    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, query);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, currentUserId: string): Promise<BlogPostCommentEntity> {
    this.checkAuthorization(currentUserId);
    await this.canCommentPost(postId);

    const existsComment = await this.blogPostCommentRepository.existsComment(postId, currentUserId);

    if (existsComment) {
      throw new ConflictException(BlogPostCommentMessage.CommentExist);
    }

    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId: currentUserId });

    await this.blogPostCommentRepository.save(commentEntity);
    await this.blogPostSevice.incrementCommentsCount(postId);

    return commentEntity;
  }

  public async deleteComment(commentId: string, currentUserId: string): Promise<void> {
    this.checkAuthorization(currentUserId);

    const commentEntity = await this.blogPostCommentRepository.findById(commentId);
    const { postId } = commentEntity;

    await this.canCommentPost(postId);
    await this.blogPostCommentRepository.deleteById(commentId);
    await this.blogPostSevice.decrementCommentsCount(postId);
  }
}
