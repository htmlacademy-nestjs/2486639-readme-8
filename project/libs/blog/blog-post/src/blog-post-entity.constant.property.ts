import { PostRdo } from './rdo/post.rdo';
import { PostApiProperty } from './blog-post.constant.property';

export const EntityApiProperty = {
  Entities: {
    description: 'The posts',
    isArray: true,
    type: PostRdo,
    example: [{
      id: PostApiProperty.Id.example,
      type: PostApiProperty.Type.example,
      tags: PostApiProperty.Tags.example,
      publishDate: PostApiProperty.PublishDate.example,
      title: PostApiProperty.Title.example,
      url: PostApiProperty.Url.example,
      previewText: PostApiProperty.PreviewText.example,
      text: PostApiProperty.Text.example,
      quoteText: PostApiProperty.QuoteText.example,
      quoteAuthor: PostApiProperty.QuoteAuthor.example,
      imagePath: PostApiProperty.ImagePath.example,
      linkDescription: PostApiProperty.LinkDescription.example,
      userId: PostApiProperty.UserId.example,
      likesCount: PostApiProperty.LikesCount.example,
      commentsCount: PostApiProperty.CommentsCount.example
    }]
  }
} as const;
