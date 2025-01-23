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

  public static createFromDtoOrEntity(
    data: CreatePostDto | BlogPostEntity,
    imagePath: string,
    tags: BlogTagEntity[],
    userId: string
  ): BlogPostEntity {
    const post: Post = {
      type: data.type,
      state: Default.NEW_POST_STATE,
      userId,
      title: data.title,
      url: data.url,
      previewText: data.previewText,
      text: data.text,
      quoteText: data.quoteText,
      quoteAuthor: data.quoteAuthor,
      imagePath,
      linkDescription: data.linkDescription
    };
    const entity = new BlogPostEntity(post);

    entity.tags = tags;

    return entity;
  }

  public static createFromPostEntity(postEntity: BlogPostEntity, userId: string): BlogPostEntity {
    const { imagePath, tags } = postEntity;
    const repostedPostEntity = BlogPostFactory.createFromDtoOrEntity(postEntity, imagePath, tags, userId);

    repostedPostEntity.repostedPost = postEntity;

    return repostedPostEntity;
  }
}
