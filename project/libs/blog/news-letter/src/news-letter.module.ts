import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NewsLetterService } from './news-letter.service';
import { NewsLetterController } from './news-letter.controller';
import { NewsLetterRepository } from './news-letter.repository';
import { NewsLetterFactory } from './news-letter.factory';
import { NewsLetterModel, NewsLetterSchema } from './news-letter.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsLetterModel.name, schema: NewsLetterSchema }
    ])
  ],
  providers: [
    NewsLetterService,
    NewsLetterRepository,
    NewsLetterFactory
  ],
  controllers: [NewsLetterController]
})
export class NewsLetterModule { }
