import { Entity, NewsLetter, StorableEntity } from '@project/shared/core';

export class NewsLetterEntity extends Entity implements StorableEntity<NewsLetter> {
  public payload: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(newsLetter?: NewsLetter) {
    super();
    this.populate(newsLetter);
  }

  public populate(newsLetter?: NewsLetter): void {
    if (!newsLetter) {
      return;
    }

    this.id = newsLetter.id ?? undefined;
    this.payload = newsLetter.payload;
    this.createdAt = newsLetter.createdAt;
    this.updatedAt = newsLetter.updatedAt;
  }

  public toPOJO(): NewsLetter {
    return {
      id: this.id,
      payload: this.payload,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
