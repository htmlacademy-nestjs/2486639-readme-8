import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import { BlogTagService } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostMessage, PostField, PostFieldsByType } from './blog-post.constant';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogTagService: BlogTagService,
    private readonly blogPostRepository: BlogPostRepository
  ) { }

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

  private allowModifyPost(postUserId: string, userId: string) {
    if (postUserId !== userId) {
      throw new ForbiddenException(BlogPostMessage.NotAllow);
    }
  }

  public async getPost(id: string) {
    const post = await this.blogPostRepository.findById(id);

    return post;
  }

  public async createPost(dto: CreatePostDto, userId: string): Promise<BlogPostEntity> {
    this.validatePostData(dto);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags, userId);

    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(id: string, dto: UpdatePostDto, userId: string) {
    this.validatePostData(dto);

    const existsPost = await this.blogPostRepository.findById(id);

    this.allowModifyPost(existsPost.userId, userId);

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

  public async deletePost(id: string, userId: string) {
    const existsPost = await this.blogPostRepository.findById(id);

    this.allowModifyPost(existsPost.userId, userId);
    await this.blogPostRepository.deleteById(id);
  }
}
