import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

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

  public async createPost(dto: CreatePostDto, userId: string): Promise<BlogPostEntity> {
    this.validatePostData(dto);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags, userId);

    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async getPost(id: string) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    return post;
  }

  public async updatePost(id: string, dto: UpdatePostDto, userId: string) {
    this.validatePostData(dto);

    const tags = await this.blogTagService.getByTitles(dto.tags);
    const postEntity = BlogPostFactory.createFromUpdatePostDto(dto, tags, userId);

    postEntity.id = id;
    await this.blogPostRepository.update(postEntity);

    return postEntity;
  }

  public async deletePost(id: string) {
    await this.blogPostRepository.deleteById(id);
  }
}
