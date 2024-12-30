import { Injectable } from '@nestjs/common';

import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';

@Injectable()
export class BlogTagService {
  constructor(
    private readonly blogTagRepository: BlogTagRepository,
  ) { }

  public async create(title: string): Promise<BlogTagEntity> {
    const tagEntity = new BlogTagEntity({ title });

    await this.blogTagRepository.save(tagEntity);

    return tagEntity;
  }

  public async getById(id: string) {
    const tag = await this.blogTagRepository.findById(id);

    return tag;
  }

  public async getByTitle(title: string) {
    const tag = await this.blogTagRepository.findByTitle(title);

    return tag;
  }
}
