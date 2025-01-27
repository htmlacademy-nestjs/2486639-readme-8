import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PaginationResult } from '@project/shared/core';
import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { BlogPostCommentMessage } from './blog-post-comment.constant';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  private checkAuthorization(userId: string): void {
    if (!userId) {
      throw new UnauthorizedException(BlogPostCommentMessage.Unauthorized);
    }
  }

  private async canViewPost(postId: string, userId: string): Promise<void> {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canViewPost(foundPost, userId);
  }

  private async canCommentPost(postId: string): Promise<void> {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canCommentPost(foundPost);
  }

  public async getComments(postId: string, userId: string, page: number): Promise<PaginationResult<BlogPostCommentEntity>> {
    await this.canViewPost(postId, userId);

    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, page);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, userId: string): Promise<BlogPostCommentEntity> {
    this.checkAuthorization(userId);
    await this.canCommentPost(postId);

    const existsComment = await this.blogPostCommentRepository.existsComment(postId, userId);

    if (existsComment) {
      throw new ConflictException(BlogPostCommentMessage.CommentExist);
    }

    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId: userId });

    await this.blogPostCommentRepository.save(commentEntity);
    await this.blogPostSevice.incrementCommentsCount(postId);

    return commentEntity;
  }

  public async deleteComment(commentId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);

    const commentEntity = await this.blogPostCommentRepository.findById(commentId);
    const { postId } = commentEntity;

    await this.canCommentPost(postId);
    await this.blogPostCommentRepository.deleteById(commentId);
    await this.blogPostSevice.decrementCommentsCount(postId);
  }
}
