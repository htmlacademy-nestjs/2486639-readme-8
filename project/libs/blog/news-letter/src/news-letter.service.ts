import { Injectable } from '@nestjs/common';

import { BlogPostService } from '@project/blog/blog-post';

import { NewsLetterRepository } from './news-letter.repository';
import { NewsLetterEntity } from './news-letter.entity';

@Injectable()
export class NewsLetterService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly newsLetterRepository: NewsLetterRepository
  ) { }

  public async sendNewsLetter(): Promise<void> {
    const lastNewsLetter = await this.newsLetterRepository.getLastNewsLetter();
    const posts = await this.blogPostSevice.findByCreateAt(lastNewsLetter.createdAt);
    console.log('posts', posts);

    const newsLetter = new NewsLetterEntity({ payload: 'empty' });

    await this.newsLetterRepository.save(newsLetter);
    console.log('newsLetter', newsLetter);
  }
}
