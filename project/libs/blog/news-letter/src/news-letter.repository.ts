import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
}
