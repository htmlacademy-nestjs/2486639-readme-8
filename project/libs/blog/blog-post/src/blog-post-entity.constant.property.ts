import { ApiPropertyOption } from '@project/shared/core';

import { PostRdo } from './rdo/post.rdo';

export const EntityApiProperty = {
  Entities: {
    description: 'The posts',
    isArray: true,
    type: PostRdo,
    example: [{
      id: ApiPropertyOption.Post.Id.example,
      type: ApiPropertyOption.Post.Type.example,
      tags: ApiPropertyOption.Post.Tags.example,
      publishDate: ApiPropertyOption.Post.PublishDate.example,
      title: ApiPropertyOption.Post.Title.example,
      url: ApiPropertyOption.Post.Url.example,
      previewText: ApiPropertyOption.Post.PreviewText.example,
      text: ApiPropertyOption.Post.Text.example,
      quoteText: ApiPropertyOption.Post.QuoteText.example,
      quoteAuthor: ApiPropertyOption.Post.QuoteAuthor.example,
      imagePath: ApiPropertyOption.Post.ImagePath.example,
      linkDescription: ApiPropertyOption.Post.LinkDescription.example,
      userId: ApiPropertyOption.User.Id.example,
      likesCount: ApiPropertyOption.Post.LikesCount.example,
      commentsCount: ApiPropertyOption.Post.CommentsCount.example
    }]
  }
} as const;
