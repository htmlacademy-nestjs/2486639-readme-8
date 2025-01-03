import { Injectable } from '@nestjs/common';

import { BlogPostCommentRepository } from './blog-post-comment.repository';
import { BlogPostCommentEntity } from './blog-post-comment.entity';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@Injectable()
export class BlogPostCommentService {
  constructor(
    private readonly blogPostCommentRepository: BlogPostCommentRepository
  ) { }

  public async getComments(postId: string): Promise<BlogPostCommentEntity[]> {
    const commentEntities = await this.blogPostCommentRepository.findByPostId(postId);

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
