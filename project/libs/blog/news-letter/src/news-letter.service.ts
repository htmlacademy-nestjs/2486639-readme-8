import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { blogConfig } from '@project/blog/config';

@Injectable()
export class NewsLetterService {
  @Inject(blogConfig.KEY)
  private readonly blogConfig: ConfigType<typeof blogConfig>;

  /*
  constructor(
    //private readonly newsLetterRepository: NewsLetterRepository
  ) { }
  */

  public async sendNewsLetter(): Promise<void> {
    console.log('BlogPostService.sendNewsLetter');
  }
}
