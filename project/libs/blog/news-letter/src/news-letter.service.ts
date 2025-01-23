import { Injectable } from '@nestjs/common';

import { fillDto } from '@project/shared/helpers';
import { BlogPostService, PostRdo } from '@project/blog/blog-post';
import { NotifyService } from '@project/blog/notify';

import { NewsLetterRepository } from './news-letter.repository';
import { NewsLetterEntity } from './news-letter.entity';

@Injectable()
export class NewsLetterService {
  constructor(
    private readonly blogPostSevice: BlogPostService,
    private readonly notifyService: NotifyService,
    private readonly newsLetterRepository: NewsLetterRepository
  ) { }

  public async sendNewsLetter(): Promise<void> {
    const lastNewsLetter = await this.newsLetterRepository.getLastNewsLetter();
    const postEntities = await this.blogPostSevice.findPostsByCreateAt(lastNewsLetter?.createdAt);

    if (!postEntities.length) {
      return;
    }

    const posts = postEntities.map((postEntity) => fillDto(PostRdo, postEntity.toPOJO()));
    const payload = JSON.stringify(posts);
    const newsLetter = new NewsLetterEntity({ payload });

    await this.newsLetterRepository.save(newsLetter);
    await this.notifyService.registerNewLetter(posts);
  }
}
