import { HttpStatus } from '@nestjs/common';

import { UserSubscriptionsCountRdo } from './rdo/user-subscriptions-count.rdo';
import { SubscriptionApiProperty } from './blog-subscription.constant.property';

export const BlogSubscriptionMessage = {
  SubscriptionNotFound: 'Subscription not found.',
  SubscriptionExist: 'You already subscription on author.',
  Unauthorized: 'Unauthorized.'
} as const;

export const userIdApiParam = {
  name: 'userId',
  schema: SubscriptionApiProperty.UserId
} as const;

export const USER_ID_PARAM = `:${userIdApiParam.name}`;

export const BlogSubscriptionApiResponse = {
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: BlogSubscriptionMessage.Unauthorized
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
    description: 'User subscriptions count.'
  }
} as const;
