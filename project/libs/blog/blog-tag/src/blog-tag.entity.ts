import { Entity, StorableEntity, Tag } from '@project/shared/core';

export class BlogTagEntity extends Entity implements StorableEntity<Tag> {
  public title: string;

  constructor(tag?: Tag) {
    super();

    this.populate(tag);
  }

  public populate(tag?: Tag): void {
    if (!tag) {
      return;
    }

    this.id = tag.id ?? undefined;
    this.title = tag.title;
  }

  public toPOJO(): Tag {
    return {
      id: this.id,
      title: this.title
    }
  }
}
