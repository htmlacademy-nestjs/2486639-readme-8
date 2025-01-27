import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { BlogPostService } from '@project/blog/blog-post';

import { BlogPostLikeEntity } from './blog-post-like.entity';
import { BlogPostLikeRepository } from './blog-post-like.repository';
import { BlogPostLikeMessage } from './blog-post-like.constant';

@Injectable()
export class BlogPostLikeService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly blogPostLikeRepository: BlogPostLikeRepository
  ) { }

  private checkAuthorization(userId: string): void {
    if (!userId) {
      throw new UnauthorizedException(BlogPostLikeMessage.Unauthorized);
    }
  }

  private async canLikePost(postId: string) {
    const foundPost = await this.blogPostSevice.findById(postId);

    this.blogPostSevice.canLikePost(foundPost);
  }

  public async like(postId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);
    await this.canLikePost(postId);

    const foundLikeId = await this.blogPostLikeRepository.findLikeId(postId, userId);

    if (foundLikeId) {
      throw new ConflictException(BlogPostLikeMessage.LikeExist);
    }

    const likeEntity = new BlogPostLikeEntity({ postId, userId: userId });

    await this.blogPostLikeRepository.save(likeEntity);
    await this.blogPostSevice.incrementLikesCount(postId);
  }

  public async unlike(postId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);
    await this.canLikePost(postId);

    const foundLikeId = await this.blogPostLikeRepository.findLikeId(postId, userId);

    if (!foundLikeId) {
      throw new NotFoundException(BlogPostLikeMessage.LikeNotFound);
    }

    await this.blogPostLikeRepository.deleteById(foundLikeId);
    await this.blogPostSevice.decrementLikesCount(postId);
  }
}
