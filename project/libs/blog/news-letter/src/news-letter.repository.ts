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

  public async getLastNewsLetter(): Promise<NewsLetterEntity> {
    const document = await this.model.aggregate<{ _id: string, createAt: Date }>([{ $group: { _id: 'id', createAt: { $max: '' } } }]).exec();
    console.log(document);
    console.log(document.length); //! первая

    //return this.createEntityFromDocument(document);
    return new NewsLetterEntity(); //!
  }
}
