import { Injectable } from '@nestjs/common';

import { fillDto } from '@project/shared/helpers';
import { BlogPostService, PostRdo } from '@project/blog/blog-post';

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
    const postEntitis = await this.blogPostSevice.findPostsByCreateAt(lastNewsLetter?.createdAt);
    const posts = fillDto(PostRdo, postEntitis)
    const payload = JSON.stringify(posts);
    const newsLetter = new NewsLetterEntity({ payload });

    await this.newsLetterRepository.save(newsLetter);
    console.log('newsLetter', newsLetter); //!
  }
}
