import { Module } from '@nestjs/common';

import { BlogTagFactory } from './blog-tag.factory';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogTagService } from './blog-tag.service';

@Module({
  providers: [
    BlogTagService,
    BlogTagRepository,
    BlogTagFactory
  ],
  exports: [BlogTagService]
})
export class BlogTagModule { }
