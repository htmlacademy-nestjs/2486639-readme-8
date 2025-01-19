import { Injectable } from '@nestjs/common';

import { EntityFactory, Post } from '@project/shared/core';
import { BlogTagEntity } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Default } from './blog-post.constant';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  public create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }

  public static createFromCreatePostDto(dto: CreatePostDto, imagePath: string, tags: BlogTagEntity[], userId: string): BlogPostEntity {
    const post: Post = {
      type: dto.type,
      state: Default.NEW_POST_STATE,
      userId,
      title: dto.title,
      url: dto.url,
      previewText: dto.previewText,
      text: dto.text,
      quoteText: dto.quoteText,
      quoteAuthor: dto.quoteAuthor,
      imagePath,
      linkDescription: dto.linkDescription
    };
    const entity = new BlogPostEntity(post);

    entity.tags = tags;

    return entity;
  }
}
