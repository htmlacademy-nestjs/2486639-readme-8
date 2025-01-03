import { Injectable } from '@nestjs/common';

import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';

@Injectable()
export class BlogTagService {
  constructor(
    private readonly blogTagRepository: BlogTagRepository,
  ) { }

  public async getByTitles(tagTitles: string[]): Promise<BlogTagEntity[]> {
    if (!tagTitles || !tagTitles.length) {
      return [];
    }

    const lowerCaseTagTitles = tagTitles.map((item) => item.toLocaleLowerCase());
    const distinctTagTitles = Array.from(new Set(lowerCaseTagTitles));
    const existTagEntities = await this.blogTagRepository.findByTitles(lowerCaseTagTitles);

    if (distinctTagTitles.length === existTagEntities.length) {
      return existTagEntities;
    }

    for (const tagTitle of distinctTagTitles) {
      if (!existTagEntities.find((tagEntity) => (tagEntity.title === tagTitle))) {
        const tagEntity = new BlogTagEntity({ title: tagTitle });

        await this.blogTagRepository.save(tagEntity);
        existTagEntities.push(tagEntity);
      }
    }

    return existTagEntities;
  }
}
