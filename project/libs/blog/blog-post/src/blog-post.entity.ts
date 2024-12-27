import { Entity, PostType, PostState, Post, StorableEntity, Tag } from '@project/shared/core';
import { BlogUserEntity } from '@project/account/blog-user';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: Tag[];
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
  public urlDescription: string;
  public user: BlogUserEntity;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(post?: Post) {
    super();

    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.type = post.type ?? undefined;
    this.tags = [] //! временно ошибка post.tags  [...post.tags]; //!  ?? undefined
    this.publishDate = post.publishDate ?? undefined;
    //! потом поправить this.repostedPost = post.repostedPost ?? undefined;
    this.state = post.state ?? undefined;
    //! потом поправить this.user = post.user ?? undefined;
    this.title = post.title ?? undefined;
    this.url = post.url ?? undefined;
    this.previewText = post.previewText ?? undefined;
    this.text = post.text ?? undefined;
    this.quoteText = post.quoteText ?? undefined;
    this.quoteAuthor = post.quoteAuthor ?? undefined;
    this.imagePath = post.imagePath ?? undefined;
    this.urlDescription = post.urlDescription ?? undefined;
    this.createdAt = post.createdAt ?? undefined;
    this.updatedAt = post.updatedAt ?? undefined;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      tags: this.tags, //! потом поправить tags.toPOJO()
      publishDate: this.publishDate,
      //! потом поправить repostedPost: this.repostedPost.toPOJO();
      state: this.state,
      title: this.title,
      url: this.url,
      previewText: this.previewText,
      text: this.text,
      quoteText: this.quoteText,
      quoteAuthor: this.quoteAuthor,
      imagePath: this.imagePath,
      urlDescription: this.urlDescription,
      //! потом поправить user: this.user на user.toPOJO(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
