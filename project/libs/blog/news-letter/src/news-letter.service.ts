import { Injectable } from '@nestjs/common';

import { NewsLetterRepository } from './news-letter.repository';
import { NewsLetterEntity } from './news-letter.entity';

@Injectable()
export class NewsLetterService {
  constructor(
    private readonly newsLetterRepository: NewsLetterRepository
  ) { }

  public async sendNewsLetter(): Promise<void> {
    const lastNewsLetter = await this.newsLetterRepository.getLastNewsLetter();
    console.log(lastNewsLetter);

    const newsLetter = new NewsLetterEntity({ payload: 'empty' });
    await this.newsLetterRepository.save(newsLetter);
    console.log(newsLetter);
  }
}
