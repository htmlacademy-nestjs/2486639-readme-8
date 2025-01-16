import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostLikeEntity } from './blog-post-like.entity';
import { BlogPostLikeRepository } from './blog-post-like.repository';
import { BlogPostLikeApiResponse, BlogPostLikeMessage } from './blog-post-like.constant';

@Injectable()
export class BlogPostLikeService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostLikeRepository: BlogPostLikeRepository
  ) { }

  private checkAuthorization(currentUserId: string): void {
    if (!currentUserId) {
      throw new UnauthorizedException(BlogPostLikeApiResponse.Unauthorized);
    }
  }

  private async canLikePost(postId: string) {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canLikePost(foundPost);
  }

  public async like(postId: string, currentUserId: string): Promise<void> {
    this.checkAuthorization(currentUserId);
    await this.canLikePost(postId);

    const foundLikeId = await this.blogPostLikeRepository.findLikeId(postId, currentUserId);

    if (foundLikeId) {
      throw new ConflictException(BlogPostLikeMessage.LikeExist);
    }

    const likeEntity = new BlogPostLikeEntity({ postId, userId: currentUserId });

    await this.blogPostLikeRepository.save(likeEntity);
    await this.blogPostSevice.incrementLikesCount(postId);
  }

  public async unlike(postId: string, currentUserId: string): Promise<void> {
    this.checkAuthorization(currentUserId);
    await this.canLikePost(postId);

    const foundLikeId = await this.blogPostLikeRepository.findLikeId(postId, currentUserId);

    if (!foundLikeId) {
      throw new NotFoundException(BlogPostLikeMessage.LikeNotFound);
    }

    await this.blogPostLikeRepository.deleteById(foundLikeId);
    await this.blogPostSevice.decrementLikesCount(postId);
  }
}
