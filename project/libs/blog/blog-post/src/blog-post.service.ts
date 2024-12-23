import { Injectable, NotFoundException } from '@nestjs/common';

import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostMessage } from './blog-post.constant';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository
  ) { }

  public async create(dto: CreatePostDto): Promise<BlogPostEntity> {
    const postEntity = new BlogPostEntity(dto);

    this.blogPostRepository.save(postEntity);

    return postEntity;
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

    const postEntity = new BlogPostEntity(dto);

    postEntity.id = id;
    await this.blogPostRepository.update(postEntity);

    return postEntity;
  }

  public async deleteById(id: string) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException(BlogPostMessage.NotFound);
    }

    await this.blogPostRepository.deleteById(id);
  }
}
