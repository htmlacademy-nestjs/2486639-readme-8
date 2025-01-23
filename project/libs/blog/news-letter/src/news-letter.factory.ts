import { Injectable } from '@nestjs/common';

import { EntityFactory, NewsLetter } from '@project/shared/core';

import { NewsLetterEntity } from './news-letter.entity';

@Injectable()
export class NewsLetterFactory implements EntityFactory<NewsLetterEntity> {
  public create(entityPlainData: NewsLetter): NewsLetterEntity {
    return new NewsLetterEntity(entityPlainData);
  }
}
