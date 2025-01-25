import { SortType } from '@project/shared/core';

export const PostQueryApiProperty = {
  SortType: {
    description: 'The sorting type',
    enum: SortType,
    example: SortType.PublishDate,
    required: false
  },
  Tag: {
    description: 'The post tag',
    example: 'tag1',
    required: false
  },
  Title: {
    description: 'The title for search posts',
    example: 'title1 title2'
  }
} as const;
