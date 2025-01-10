import { Entity, PostType, PostState, Post, StorableEntity, Tag } from '@project/shared/core';
import { BlogTagEntity } from '@project/blog/blog-tag';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: BlogTagEntity[];
  public publishDate: Date;
  public repostedPost: BlogPostEntity;
  public state: PostState;
  public title: string;
  public url: string;
  public previewText: string;
  public text: string;
  public quoteText: string;
  public quoteAuthor: string;
  public imagePath: string;
  public linkDescription: string;
  public userId: string;
  public createdAt: Date;
  public updatedAt: Date;
  public likesCount: number;
  public commentsCount: number;

  constructor(post?: Post) {
    super();

    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.type = post.type;
    this.tags = [];
    this.publishDate = post.publishDate ?? undefined;
    this.repostedPost = undefined;
    this.state = post.state ?? undefined;
    this.userId = post.userId ?? undefined;
    this.title = post.title ?? undefined;
    this.url = post.url ?? undefined;
    this.previewText = post.previewText ?? undefined;
    this.text = post.text ?? undefined;
    this.quoteText = post.quoteText ?? undefined;
    this.quoteAuthor = post.quoteAuthor ?? undefined;
    this.imagePath = post.imagePath ?? undefined;
    this.linkDescription = post.linkDescription ?? undefined;
    this.createdAt = post.createdAt ?? undefined;
    this.updatedAt = post.updatedAt ?? undefined;
    this.likesCount = post.likesCount ?? undefined;
    this.commentsCount = post.commentsCount ?? undefined;

    if (post.tags) {
      for (const tag of post.tags) {
        const blogTagEntity = new BlogTagEntity(tag);

        this.tags.push(blogTagEntity);
      }
    }

    if (post.repostedPost) {
      this.repostedPost = new BlogPostEntity(post.repostedPost);
    }
  }

  public toPOJO(): Post {
    const tags: Tag[] = (this.tags)
      ? this.tags.map((tagEntity) => tagEntity.toPOJO())
      : [];

    return {
      id: this.id,
      type: this.type,
      tags,
      publishDate: this.publishDate,
      repostedPost: this.repostedPost?.toPOJO(),
      state: this.state,
      title: this.title,
      url: this.url,
      previewText: this.previewText,
      text: this.text,
      quoteText: this.quoteText,
      quoteAuthor: this.quoteAuthor,
      imagePath: this.imagePath,
      linkDescription: this.linkDescription,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      likesCount: this.likesCount,
      commentsCount: this.commentsCount
    }
  }
}
