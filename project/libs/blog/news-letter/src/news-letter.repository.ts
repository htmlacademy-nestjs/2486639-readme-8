import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SortDirection } from '@project/shared/core';
import { BaseMongoRepository } from '@project/shared/data-access';

import { NewsLetterEntity } from './news-letter.entity';
import { NewsLetterModel } from './news-letter.model';
import { NewsLetterFactory } from './news-letter.factory';

@Injectable()
export class NewsLetterRepository extends BaseMongoRepository<NewsLetterEntity, NewsLetterModel> {
  constructor(
    entityFactory: NewsLetterFactory,
    @InjectModel(NewsLetterModel.name)
    newsLetterModel: Model<NewsLetterModel>
  ) {
    super(entityFactory, newsLetterModel);
  }

  public async getLastNewsLetter(): Promise<NewsLetterEntity | null> {
    const documents = await this.model.find().sort({ createdAt: SortDirection.Desc }).limit(1).exec();

    if (!documents.length) {
      return null;
    }

    return this.createEntityFromDocument(documents[0]);
  }
}
