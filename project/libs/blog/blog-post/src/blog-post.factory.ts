import { Injectable } from '@nestjs/common';

import { EntityFactory, Post, PostState } from '@project/shared/core';
import { BlogTagEntity } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  public create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }

  public static createFromCreatePostDto(dto: CreatePostDto, tags: BlogTagEntity[]): BlogPostEntity {
    const entity = new BlogPostEntity();

    entity.state = PostState.Published;
    entity.tags = tags;
    entity.comments = [];

    return entity;
  }
}
