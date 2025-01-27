import { PostState } from '../types/post-state.enum';
import { PostType } from '../types/post-type.enum';

export const ApiPropertyOption = {
  User: {
    Id: {
      description: 'The unique user ID',
      example: '658170cbb954e9f5b905ccf4'
    },
    Email: {
      description: 'The unique user email',
      example: 'user@local.local'
    },
    Name: {
      description: 'The user name',
      example: 'Name'
    },
    Password: {
      description: 'The user password',
      example: 'password'
    },
    OldPassword: {
      description: 'The user old password',
      example: 'password'
    },
    NewPassword: {
      description: 'The user new password',
      example: 'password'
    },
    AvatarPath: {
      description: 'The user avatar path',
      example: '/img/avatar.jpg'
    },
    AvatarFile: {
      required: false,
      description: 'The avatar file',
      type: 'string',
      format: 'binary'
    },
    registrationDate: {
      description: 'The user registration date',
      type: 'string',
      example: '2025-01-20'
    },
    AccessToken: {
      description: 'The user access JWT token',
      example: 'asdasdsdfetyhetyhythgfnghnlkcsdkfajowfjlsdkmcv'
    },
    RefreshToken: {
      description: 'The user refresh JWT token',
      example: 'fvdfvbdgbsdfbfgbfgfghdr6he5656hsrthsfhfg'
    }
  },
  Post: {
    Id: {
      description: 'The unique post ID',
      example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
    },
    Type: {
      description: 'The post type',
      enum: PostType,
      example: PostType.Video
    },
    State: {
      description: 'The post state',
      enum: PostState,
      example: PostState.Published
    },
    PublishDate: {
      description: 'The post publish date',
      example: '2024-07-09'
    },
    // для формирования "for types:..." можно применить PostFieldsByType, но данные поля по типам, а тут нужно типы по полям
    Title: {
      description: 'The post title for types: video and text',
      required: false,
      example: 'title title title title'
    },
    Url: {
      description: 'The post url for types: video and link',
      required: false,
      example: 'http://local.ru/12345'
    },
    PreviewText: {
      description: 'The post preview text for type: text',
      required: false,
      example: 'preview text preview text preview text preview text'
    },
    Text: {
      description: 'The post text for type: text',
      required: false,
      example: 'text text text text text text text text text text text text text text text text text text text text text'
    },
    QuoteText: {
      description: 'The post quote text for type: quote',
      required: false,
      example: 'quote text quote text'
    },
    QuoteAuthor: {
      description: 'The post quote author for type: quote',
      required: false,
      example: 'quote author'
    },
    ImagePath: {
      description: 'The post image path for type: photo',
      required: false,
      example: '/img/12345.jpg'
    },
    ImageFile: {
      description: 'The post image file for type: photo',
      required: false,
      type: 'string',
      format: 'binary'
    },
    LinkDescription: {
      description: 'The post link description for type: link',
      required: false,
      example: 'link description'
    },
    //
    LikesCount: {
      description: 'The post likes count',
      example: 5
    },
    CommentsCount: {
      description: 'The post comments count',
      example: 5
    },
    IsRepost: {
      description: 'The post is repost attribute',
      example: 'true'
    },
    RepostedPostId: {
      description: 'The reposted post id',
      required: false,
      example: '2f31b19b-97eb-4305-877a-0b9be7faca8f'
    },
    RepostedPostUserId: {
      description: 'The reposted post user id',
      required: false,
      example: '658170cbb954e9f5b905ccf4'
    },
    Tags: {
      description: 'The post tags - warning! not correct send string[] on swagger!',
      example: ['tag1'],// ['tag1', 'tag2'], из swagger-а не коректно передает пример, у значений убирает [] и ""
      name: 'tags[]', // не корректная передача string[] через form-data
      required: false
    },
    PostsCount: {
      description: 'The user posts count',
      example: 5
    },
    SubscriptionsCount: {
      description: 'The user subscriptions count',
      example: 5
    },
    Entities: {
      description: 'The posts',
      isArray: true
    }
  },
  Comment: {
    Id: {
      description: 'Comment id',
      example: '2f31b19b-97eb-4305-888a-0b9be7faca8f'
    },
    Message: {
      description: 'Comment message',
      example: 'Comment message, comment message'
    },
    CreatedAt: {
      description: 'Comment date',
      example: '2024-12-27T08:29:40.245Z'
    },
    Entities: {
      description: 'The post comments',
      isArray: true
    }
  }
} as const;
