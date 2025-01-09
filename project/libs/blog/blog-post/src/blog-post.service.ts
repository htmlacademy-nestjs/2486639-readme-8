import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PaginationResult, PostState } from '@project/shared/core';
import { BlogTagService } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostMessage, PostField, PostFieldsByType } from './blog-post.constant';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogTagService: BlogTagService,
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  //! вынести отдельно
  private validatePostData(dto: CreatePostDto | UpdatePostDto): void {
    const { type } = dto;
    const messages: string[] = [];
    const keys = Object.values(PostField);

    if (!type) {
      keys.forEach((key) => {
        if (dto[key]) {
          messages.push(key);
        }

        if (messages.length) {
          messages.unshift('For empty post type not need:');
        }
      })
    } else {
      const fields = PostFieldsByType[type];
      const needMessages: string[] = [];
      const notNeedMessages: string[] = [];

      keys.forEach((key) => {
        //const shouldBeKey = fields.includes(key); //! Argument of type 'PostField' is not assignable to parameter of type 'never'
        const shouldBeKey = [...fields].includes(key);
        const existDtoKey = !!dto[key];

        if (shouldBeKey && !existDtoKey) {
          needMessages.push(key);
        }

        if (!shouldBeKey && existDtoKey) {
          notNeedMessages.push(key);
        }
      })

      if (needMessages.length || notNeedMessages.length) {
        messages.push(`For post type "${type}"`);

        if (needMessages.length) {
          messages.push(`need: ${needMessages.join(', ')}`);
        }

        if (notNeedMessages.length) {
          if (needMessages.length) {
            messages.push('and');
          }
          messages.push(`not need: ${notNeedMessages.join(', ')}`);
        }
      }
    }

    if (messages.length) {
      throw new BadRequestException(messages.join(' '));
    }
  }

  private allowModifyPost(post: BlogPostEntity, currentUserId: string) {
    if (post.userId !== currentUserId) {
      throw new ForbiddenException(BlogPostMessage.NotAllow);
    }
  }

  private allowViewPost(post: BlogPostEntity, currentUserId: string) {
    if (post.state !== PostState.Published) {
      if (post.userId !== currentUserId) {
        throw new NotFoundException(BlogPostMessage.NotFound);
      }
    }
  }

  public async existsPost(postId: string, currentUserId: string): Promise<void> {
    const existsPost = await this.blogPostRepository.findById(postId, false);

    if (!existsPost) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    this.allowViewPost(existsPost, currentUserId);
  }

  public async getAllPosts(query: BlogPostQuery, currentUserId: string): Promise<PaginationResult<BlogPostEntity>> {
    //! если требуется показать черновики автора, то query.userId === currentUserId, иначе отключем показ черновиков
    query.showDraft = ((query.showDraft) && (query.userId) && (query.userId === currentUserId));

    return await this.blogPostRepository.find(query);
  }

  public async getPost(postId: string, currentUserId: string) {
    //! нужно проверить кто просмтаривает... автор или нет? опубликованные доступны всем, черновики только автору
    await this.existsPost(postId, currentUserId);

    const post = await this.blogPostRepository.findById(postId);

    return post;
  }

  public async createPost(dto: CreatePostDto, currentUserId: string): Promise<BlogPostEntity> {
    this.validatePostData(dto);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags, currentUserId);

    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(postId: string, dto: UpdatePostDto, currentUserId: string) {
    this.validatePostData(dto);

    const existsPost = await this.blogPostRepository.findById(postId);

    this.allowModifyPost(existsPost, currentUserId);

    let isSameTags = true;
    let hasChanges = false;

    // обнуляем поля, чтобы был null в БД
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
    Object.values(PostField).forEach((key) => {
      if (existsPost[key] === null) {
        existsPost[key] = undefined;
      }
    });

    return existsPost;
  }

  public async deletePost(postId: string, currentUserId: string) {
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
