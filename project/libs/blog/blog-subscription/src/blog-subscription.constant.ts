import { HttpStatus } from '@nestjs/common';

import { UserSubscriptionsCountRdo } from './rdo/user-subscriptions-count.rdo';

export const BlogSubscriptionMessage = {
  SubscriptionNotFound: 'Subscription not found.',
  SubscriptionExist: 'You already subscription on author.'
} as const;

export const userIdApiParam = {
  name: 'userId',
  schema: {
    description: 'The user ID',
    example: '658170cbb954e9f5b905ccf4'
  }
} as const;

export const USER_ID_PARAM = `:${userIdApiParam.name}`;

export const BlogSubscriptionApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  SubscriptionCreated: {
    status: HttpStatus.CREATED,
    description: 'The subscription has been successfully created.'
  },
  SubscriptionDeleted: {
    status: HttpStatus.NO_CONTENT,
    description: 'The subscription has been successfully deleted.'
  },
  SubscriptionNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: BlogSubscriptionMessage.SubscriptionNotFound
  },
  SubscriptionExist: {
    status: HttpStatus.CONFLICT,
    description: BlogSubscriptionMessage.SubscriptionExist
  },
  UserSubscriptionsCount: {
    type: UserSubscriptionsCountRdo,
    status: HttpStatus.OK,
    description: 'User subscriptions count.',
    example: { userID: '111111111', subscriptionsCount: 5 } // в Swagger не формирует пример ответа...
  }
} as const;
