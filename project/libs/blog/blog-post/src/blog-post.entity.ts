import { Entity, PostType, PostState, Post, StorableEntity, Tag } from '@project/shared/core';
import { BlogUserEntity } from '@project/account/blog-user';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public type: PostType;
  public tags: Tag[];
  public publishDate: Date;
  public repostedPost: BlogPostEntity;
  public state: PostState;
  public url: string;
  public previewText: string;
  public text: string;
  public quoteText: string;
  public quoteAuthor: string;
  public imagePath: string;
  public urlDescription: string;
  public user: BlogUserEntity;

  constructor(post?: Post) {
    super();

    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? '';
    this.type = post.type;
    this.tags = [...post.tags];
    this.publishDate = post.publishDate;
    //! потом поправить this.repostedPost = post.repostedPost;
    this.state = post.state;
    this.url = post.url;
    this.previewText = post.previewText;
    this.text = post.text;
    this.quoteText = post.quoteText;
    this.quoteAuthor = post.quoteAuthor;
    this.imagePath = post.imagePath;
    this.urlDescription = post.urlDescription;
    //! потом поправить this.user = post.user;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      tags: this.tags, //! потом поправить tags.toPOJO()
      publishDate: this.publishDate,
      //! потом поправить repostedPost: this.repostedPost.toPOJO();
      state: this.state,
      url: this.url,
      previewText: this.previewText,
      text: this.text,
      quoteText: this.quoteText,
      quoteAuthor: this.quoteAuthor,
      imagePath: this.imagePath,
      urlDescription: this.urlDescription,
      //! потом поправить user: this.user на user.toPOJO()
    }
  }
}
