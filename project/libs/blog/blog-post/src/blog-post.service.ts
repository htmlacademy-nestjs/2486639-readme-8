import { Injectable, NotFoundException } from '@nestjs/common';

import { BlogTagEntity, BlogTagService } from '@project/blog/blog-tag';
import { PostState } from '@project/shared/core';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostMessage } from './blog-post.constant';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogTagService: BlogTagService,
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  public async create(dto: CreatePostDto): Promise<BlogPostEntity> {
    //const tags = await this.blogTagService.getByIds(dto.tags);
    const tags: BlogTagEntity[] = [];//! временно
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags);

    await this.blogPostRepository.save(newPost);

    //! тест
    try {
      const tagEntity = await this.blogTagService.create('tag1111');
      console.log(tagEntity);

      const tag1 = await this.blogTagService.getById('2067063f-8dc2-42bc-bb5f-84bce5caa9fd')
      console.log(tag1);

      const tag2 = await this.blogTagService.getByTitle('tag2')
      console.log(tag2);

    } catch (error) {
      console.log('tag test error', error);
    }
    //

    return newPost;
  }

  public async getById(id: string) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    return post;
  }

  public async updateById(id: string, dto: UpdatePostDto) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    console.log(dto); //! тест

    //! временно
    //const postEntity = new BlogPostEntity(dto);

    //postEntity.id = id;
    //await this.blogPostRepository.update(postEntity);

    //return postEntity;
    //
    return post;
  }

  public async deleteById(id: string) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    await this.blogPostRepository.deleteById(id);
  }
}
