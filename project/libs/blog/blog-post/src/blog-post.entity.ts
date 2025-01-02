import { Entity, PostType, PostState, Post, StorableEntity } from '@project/shared/core';
import { BlogTagEntity, BlogTagFactory } from '@project/blog/blog-tag';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: BlogTagEntity[];
  public publishDate: Date;
  //public repostedPost: BlogPostEntity; //! позже переделать  Ref<UserEntity>  ?
  public repostedPostId: string;
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
    //! потом поправить this.repostedPost = post.repostedPost ?? undefined;
    this.repostedPostId = post.repostedPostId ?? undefined;
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

    const blogTagFactory = new BlogTagFactory();

    for (const tag of post.tags) {
      const blogTagEntity = blogTagFactory.create(tag);

      this.tags.push(blogTagEntity);
    }
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      tags: this.tags.map((tagEntity) => tagEntity.toPOJO()),
      publishDate: this.publishDate,
      //! потом поправить repostedPost: this.repostedPost.toPOJO();
      repostedPostId: this.repostedPostId,
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
