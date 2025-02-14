import {
  BadRequestException, ConflictException, ForbiddenException, Inject, Injectable,
  InternalServerErrorException, Logger, NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { join } from 'path/posix';

import { PaginationResult, PostState, RouteAlias } from '@project/shared/core';
import { parseAxiosError, uploadFile } from '@project/shared/helpers';
import { BlogTagService } from '@project/blog/blog-tag';
import { blogConfig } from '@project/blog/config';
import { FILE_KEY, UploadedFileRdo } from '@project/file-storage/file-uploader';
import { BlogSubscriptionService } from '@project/blog/blog-subscription';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostQuery } from './query/blog-post.query';
import { BaseBlogPostQuery } from './query/base-blog-post.query';
import { SearchBlogPostQuery } from './query/search-blog-post.query';
import { BlogPostMessage, Default, PostField } from './blog-post.constant';
import { validatePostData } from './blog-post.validate.post.data';

@Injectable()
export class BlogPostService {
  @Inject(blogConfig.KEY)
  private readonly blogOptions: ConfigType<typeof blogConfig>;

  constructor(
    private readonly blogTagService: BlogTagService,
    private readonly blogSubscriptionService: BlogSubscriptionService,
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  private validatePostData(dto: CreatePostDto | UpdatePostDto, imageFile: Express.Multer.File): void {
    dto.imageFile = (imageFile) ? '/some/path' : undefined;

    const message = validatePostData(dto);

    if (message) {
      throw new BadRequestException(message);
    }
  }

  private async uploadImageFile(imageFile: Express.Multer.File, requestId: string): Promise<string> {
    if (!imageFile) {
      return undefined;
    }

    try {
      const fileRdo = await uploadFile<UploadedFileRdo>(
        join(this.blogOptions.fileStorageServiceUrl, RouteAlias.Upload),
        imageFile,
        FILE_KEY,
        requestId
      );

      return join(fileRdo.subDirectory, fileRdo.hashName);
    } catch (error) {
      Logger.error(`UploadImageFile: ${parseAxiosError(error)}`, BlogPostService.name);

      throw new InternalServerErrorException('File upload error!');
    }
  }

  private isPublishedPost(post: BlogPostEntity): boolean {
    return post.state === PostState.Published;
  }

  private checkAuthorization(userId: string): void {
    if (!userId) {
      throw new UnauthorizedException(BlogPostMessage.Unauthorized);
    }
  }

  private canChangePost(post: BlogPostEntity, userId: string): void {
    if (post.userId !== userId) {
      throw new ForbiddenException(BlogPostMessage.NotAllow);
    }
  }

  private throwIfPostNotPublished(post: BlogPostEntity): void {
    if (!this.isPublishedPost(post)) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }
  }

  public canViewPost(post: BlogPostEntity, userId: string): void {
    if (post.userId !== userId) {
      this.throwIfPostNotPublished(post);
    }
  }

  public canCommentPost(post: BlogPostEntity): void {
    this.throwIfPostNotPublished(post);
  }

  public canLikePost(post: BlogPostEntity): void {
    this.throwIfPostNotPublished(post);
  }

  public async findById(postId: string): Promise<BlogPostEntity> {
    const foundPost = await this.blogPostRepository.findById(postId);

    return foundPost;
  }

  public async getAllPosts(
    searchQuery: SearchBlogPostQuery,
    currentUserId: string,
    checkAuthorization: boolean,
    showDraft: boolean
  ): Promise<PaginationResult<BlogPostEntity>> {
    if (checkAuthorization) {
      this.checkAuthorization(currentUserId);
    }

    const { page, sortType, tag, type, userId } = searchQuery;
    const query: BlogPostQuery = {
      page,
      sortType,
      tag,
      type,
      userIds: (userId) ? [userId] : undefined
    };
    const result = await this.blogPostRepository.find(query, showDraft, Default.POST_COUNT);

    return result;
  }

  public async getFeed(baseQuery: BaseBlogPostQuery, userId: string): Promise<PaginationResult<BlogPostEntity>> {
    this.checkAuthorization(userId);

    const userIds = await this.blogSubscriptionService.getUserSubscriptions(userId);
    const { page, sortType, tag, type } = baseQuery;
    const query: BlogPostQuery = {
      page,
      sortType,
      tag,
      type,
      userIds: [...userIds, userId]
    };
    const result = await this.blogPostRepository.find(query, false, Default.POST_COUNT);

    return result;
  }

  public async getPost(postId: string, userId: string): Promise<BlogPostEntity> {
    const post = await this.blogPostRepository.findById(postId, true);
    // проверяем кто просмтаривает... автор или нет? опубликованные доступны всем, черновики только автору
    this.canViewPost(post, userId);

    return post;
  }

  public async createPost(
    dto: CreatePostDto,
    imageFile: Express.Multer.File,
    userId: string,
    requestId: string
  ): Promise<BlogPostEntity> {
    this.checkAuthorization(userId);
    this.validatePostData(dto, imageFile);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const imagePath = await this.uploadImageFile(imageFile, requestId);
    const newPost = BlogPostFactory.createFromDtoOrEntity(dto, imagePath, tags, userId);

    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(
    postId: string,
    dto: UpdatePostDto,
    imageFile: Express.Multer.File,
    userId: string,
    requestId: string
  ): Promise<BlogPostEntity> {
    this.checkAuthorization(userId);
    this.validatePostData(dto, imageFile);

    const existsPost = await this.blogPostRepository.findById(postId, true);

    this.canChangePost(existsPost, userId);

    let isSameTags = true;
    let hasChanges = false;

    // обнуляем поля, чтобы был null в БД
    // можно вынести отдельно
    Object.values(PostField).forEach((key) => {
      existsPost[key] = null;
    });
    existsPost.imagePath = null;

    for (const [key, value] of Object.entries(dto)) {
      if (key === 'tags') {
        if (value) {
          const currentTagIds = existsPost.tags.map((tag) => tag.id);

          isSameTags = (currentTagIds.length === value.length) && (currentTagIds.some((tagId) => value.includes(tagId)));

          if (!isSameTags) {
            existsPost.tags = await this.blogTagService.getByTitles(dto.tags);
          }
        }
      } else if (key === PostField.ImageFile) {
        if (imageFile) {
          existsPost.imagePath = await this.uploadImageFile(imageFile, requestId);
          hasChanges = true;
        }
      }
      else {
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

    if (existsPost.imagePath === null) {
      existsPost.imagePath = undefined;
    }

    return existsPost;
  }

  public async repostPost(postId: string, userId: string): Promise<BlogPostEntity> {
    this.checkAuthorization(userId);

    const existsPost = await this.blogPostRepository.findById(postId, true);

    this.canViewPost(existsPost, userId);

    const existsRepost = await this.blogPostRepository.existsRepost(postId, userId);

    if (existsRepost) {
      throw new ConflictException(BlogPostMessage.RepostExist);
    }

    const repostedPost = BlogPostFactory.createFromPostEntity(existsPost, userId);

    await this.blogPostRepository.save(repostedPost);

    return repostedPost;
  }

  public async deletePost(postId: string, userId: string): Promise<void> {
    this.checkAuthorization(userId);

    const existsPost = await this.blogPostRepository.findById(postId);

    this.canChangePost(existsPost, userId);
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

  public async getUserPostsCount(userId: string): Promise<number> {
    const postsCount = await this.blogPostRepository.getUserPostsCount(userId);

    return postsCount;
  }

  public async findPostsByTitle(searchTitle: string): Promise<BlogPostEntity[]> {
    const posts = await this.blogPostRepository.findPostsByTitle(searchTitle, Default.SEACRH_TITLE_POST_COUNT);

    return posts;
  }

  public async findPostsByCreateAt(startDate: Date): Promise<BlogPostEntity[]> {
    const posts = await this.blogPostRepository.findPostsByCreateAt(startDate, Default.NEWS_LETTER_POST_COUNT);

    return posts;
  }
}
