import { Injectable } from '@nestjs/common';

import { EntityFactory, Post } from '@project/shared/core';
import { BlogTagEntity } from '@project/blog/blog-tag';

import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { DEFAULT_NEW_POST_STATE } from './blog-post.constant';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  public create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }

  public static createFromCreatePostDto(dto: CreatePostDto, tags: BlogTagEntity[], userId: string): BlogPostEntity {
    const entity = new BlogPostEntity();
    //const entity = new BlogPostEntity({ state: DEFAULT_NEW_POST_STATE, userId, type: dto.type, tags: [] });
    //! если вызвать с мининумом, то  entity.id уже будет undefined
    entity.id = undefined; //! пустая строка из базового класса и id не гененируется

    entity.type = dto.type;
    entity.state = DEFAULT_NEW_POST_STATE;
    entity.tags = tags;
    entity.title = dto.title;
    entity.url = dto.url;
    entity.previewText = dto.previewText;
    entity.text = dto.text;
    entity.quoteText = dto.quoteText;
    entity.quoteAuthor = dto.quoteAuthor;
    entity.imagePath = dto.imagePath;
    entity.linkDescription = dto.linkDescription;
    entity.userId = userId;

    return entity;
  }
}
