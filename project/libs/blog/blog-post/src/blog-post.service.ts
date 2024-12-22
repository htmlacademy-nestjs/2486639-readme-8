import { Injectable, NotFoundException } from '@nestjs/common';

import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';

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

  public async getPost(id: string) {
    const post = await this.blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundException('Not Found111');
    }

    return post;
  }
}
