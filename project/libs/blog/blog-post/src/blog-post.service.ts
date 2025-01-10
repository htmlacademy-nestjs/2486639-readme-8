import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PaginationResult, PostState } from '@project/shared/core';
import { BlogTagService } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostApiResponse, BlogPostMessage, PostField } from './blog-post.constant';
import { validatePostData } from './blog-post.validate.post.data';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogTagService: BlogTagService,
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  private validatePostData(dto: CreatePostDto | UpdatePostDto): void {
    const message = validatePostData(dto);

    if (message) {
      throw new BadRequestException(message);
    }
  }

  private checkAuthorization(currentUserId: string) {
    if (!currentUserId) {
      throw new UnauthorizedException(BlogPostApiResponse.Unauthorized);
    }
  }

  private allowModifyPost(post: BlogPostEntity, currentUserId: string) {
    if (post.userId !== currentUserId) {
      throw new ForbiddenException(BlogPostMessage.NotAllow);
    }
  }

  public allowViewPost(post: BlogPostEntity, currentUserId: string) {
    if (post.userId !== currentUserId) {
      this.allowCommentAndLikePost(post);
    }
  }

  public allowCommentAndLikePost(post: BlogPostEntity) {
    if (post.state !== PostState.Published) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }
  }

  public async findById(postId: string) {
    const foundPost = await this.blogPostRepository.findById(postId);

    return foundPost;
  }

  public async getAllPosts(query: BlogPostQuery, currentUserId: string): Promise<PaginationResult<BlogPostEntity>> {
    // если требуется показать черновики автора, то query.userId === currentUserId, иначе отключем показ черновиков
    query.showDraft = ((query.showDraft) && (query.userId) && (query.userId === currentUserId));

    return await this.blogPostRepository.find(query);
  }

  public async getPost(postId: string, currentUserId: string) {
    const post = await this.blogPostRepository.findById(postId, true);
    // проверяем кто просмтаривает... автор или нет? опубликованные доступны всем, черновики только автору
    this.allowViewPost(post, currentUserId);

    return post;
  }

  public async createPost(dto: CreatePostDto, currentUserId: string): Promise<BlogPostEntity> {
    this.checkAuthorization(currentUserId);
    this.validatePostData(dto);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags, currentUserId);

    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(postId: string, dto: UpdatePostDto, currentUserId: string) {
    this.checkAuthorization(currentUserId);
    this.validatePostData(dto);

    const existsPost = await this.blogPostRepository.findById(postId, true);

    this.allowModifyPost(existsPost, currentUserId);

    let isSameTags = true;
    let hasChanges = false;

    // обнуляем поля, чтобы был null в БД
    // можно вынести отдельно
    Object.values(PostField).forEach((key) => {
      existsPost[key] = null;
    });

    for (const [key, value] of Object.entries(dto)) {
      if (key === 'tags') {
        if (value) {
          const currentTagIds = existsPost.tags.map((tag) => tag.id);

          isSameTags = (currentTagIds.length === value.length) && (currentTagIds.some((tagId) => value.includes(tagId)));

          if (!isSameTags) {
            existsPost.tags = await this.blogTagService.getByTitles(dto.tags);
          }
        }
      } else {
        if (value !== undefined && existsPost[key] !== value) {
          existsPost[key] = value;
          hasChanges = true;
        }
      }
    }

    if (!isSameTags || hasChanges) {
      await this.blogPostRepository.update(existsPost);
    }

    // поля с null в undefined, чтобы их небыло в rdo
    // можно вынести отдельно
    Object.values(PostField).forEach((key) => {
      if (existsPost[key] === null) {
        existsPost[key] = undefined;
      }
    });

    return existsPost;
  }

  public async deletePost(postId: string, currentUserId: string) {
    this.checkAuthorization(currentUserId);

    const existsPost = await this.blogPostRepository.findById(postId);

    this.allowModifyPost(existsPost, currentUserId);
    await this.blogPostRepository.deleteById(postId);
  }

  public async incrementCommentsCount(postId: string): Promise<void> {
    await this.blogPostRepository.updateCommentsCount(postId, 1);
  }

  public async decrementCommentsCount(postId: string): Promise<void> {
    await this.blogPostRepository.updateCommentsCount(postId, -1);
  }

  public async incrementLikesCount(postId: string): Promise<void> {
    await this.blogPostRepository.updateLikesCount(postId, 1);
  }

  public async decrementLikesCount(postId: string): Promise<void> {
    await this.blogPostRepository.updateLikesCount(postId, -1);
  }
}
