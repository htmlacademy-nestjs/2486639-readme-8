import { Injectable, NotFoundException } from '@nestjs/common';

import { BlogTagService } from '@project/blog/blog-tag';

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

  public async create(dto: CreatePostDto, userId: string): Promise<BlogPostEntity> {
    const tags = await this.blogTagService.getByTitles(dto.tags);
    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags, userId);

    await this.blogPostRepository.save(newPost);

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
