import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PaginationResult } from '@project/shared/core';
import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { BlogPostCommentApiResponse, BlogPostCommentMessage } from './blog-post-comment.constant';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  private checkAuthorization(currentUserId: string) {
    if (!currentUserId) {
      throw new UnauthorizedException(BlogPostCommentApiResponse.Unauthorized);
    }
  }

  private async allowViewPost(postId: string, currentUserId: string) {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.allowViewPost(foundPost, currentUserId);
  }

  private async allowCommentAndLikePost(postId: string) {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.allowCommentAndLikePost(foundPost);
  }

  public async getComments(postId: string, currentUserId: string, query: BlogPostCommentQuery): Promise<PaginationResult<BlogPostCommentEntity>> {
    await this.allowViewPost(postId, currentUserId);

    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId, query);

    return commentEntities;
  }

  public async createComment(dto: CreatePostCommentDto, postId: string, currentUserId: string): Promise<BlogPostCommentEntity> {
    this.checkAuthorization(currentUserId);
    await this.allowCommentAndLikePost(postId);

    const foundCommentId = await this.blogPostCommentRepository.findCommentId(postId, currentUserId);

    if (foundCommentId) {
      throw new ConflictException(BlogPostCommentMessage.CommentExist);
    }

    const { message } = dto;
    const commentEntity = new BlogPostCommentEntity({ message, postId, userId: currentUserId });

    await this.blogPostCommentRepository.save(commentEntity);
    await this.blogPostSevice.incrementCommentsCount(postId);

    return commentEntity;
  }

  public async deleteComment(postId: string, currentUserId: string) {
    this.checkAuthorization(currentUserId);
    await this.allowCommentAndLikePost(postId);

    const foundCommentId = await this.blogPostCommentRepository.findCommentId(postId, currentUserId);

    if (!foundCommentId) {
      throw new NotFoundException(BlogPostCommentMessage.CommentNotFound);
    }

    await this.blogPostCommentRepository.deleteById(foundCommentId);
    await this.blogPostSevice.decrementCommentsCount(postId);
  }
}
