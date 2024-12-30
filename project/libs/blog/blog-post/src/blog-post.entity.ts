import { Entity, PostType, PostState, Post, StorableEntity } from '@project/shared/core';
import { BlogTagEntity, BlogTagFactory } from '@project/blog/blog-tag';
import { BlogPostCommentEntity, BlogPostCommentFactory } from '@project/blog/blog-post-comment';
import { BlogUserEntity } from '@project/account/blog-user';

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
  public user: BlogUserEntity;
  public createdAt: Date;
  public updatedAt: Date;
  public likesCount: number;
  public commentsCount: number;
  public comments: BlogPostCommentEntity[];

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
    this.tags = [];
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
    this.linkDescription = post.linkDescription ?? undefined;
    this.createdAt = post.createdAt ?? undefined;
    this.updatedAt = post.updatedAt ?? undefined;
    this.likesCount = post.likesCount ?? undefined;
    this.commentsCount = post.commentsCount ?? undefined;
    this.comments = [];

    const blogTagFactory = new BlogTagFactory();

    for (const tag of post.tags) {
      const blogTagEntity = blogTagFactory.create(tag);

      this.tags.push(blogTagEntity);
    }

    const blogPostCommentFactory = new BlogPostCommentFactory();

    for (const comment of post.comments) {
      const blogPostCommentEntity = blogPostCommentFactory.create(comment);

      this.comments.push(blogPostCommentEntity);
    }
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      tags: this.tags.map((tagEntity) => tagEntity.toPOJO()),
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
      linkDescription: this.linkDescription,
      //! потом поправить user: this.user на user.toPOJO(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      likesCount: this.likesCount,
      commentsCount: this.commentsCount,
      comments: this.comments.map((commentEntity) => commentEntity.toPOJO())
    }
  }
}
