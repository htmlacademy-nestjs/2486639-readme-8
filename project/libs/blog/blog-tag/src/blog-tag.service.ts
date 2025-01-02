import { Injectable } from '@nestjs/common';

import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';

@Injectable()
export class BlogTagService {
  constructor(
    private readonly blogTagRepository: BlogTagRepository,
  ) { }

  public async getByTitles(tagTitles: string[]): Promise<BlogTagEntity[]> {
    const lowerCaseTagTitles = tagTitles.map((item) => item.toLocaleLowerCase());
    const existTagEntities = await this.blogTagRepository.findByTitles(lowerCaseTagTitles);

    if (lowerCaseTagTitles.length === existTagEntities.length) {
      return existTagEntities;
    }

    for (const lowerCaseTagTitle of lowerCaseTagTitles) {
      if (!existTagEntities.find((tagEntity) => (tagEntity.title === lowerCaseTagTitle))) {
        const tagEntity = new BlogTagEntity({ title: lowerCaseTagTitle });

        await this.blogTagRepository.save(tagEntity);
        console.log(tagEntity);

        existTagEntities.push(tagEntity);
      }
    }

    return existTagEntities;
  }
}
