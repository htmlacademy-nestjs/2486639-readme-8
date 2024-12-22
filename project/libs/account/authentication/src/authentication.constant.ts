import { HttpStatus } from "@nestjs/common";

import { AuthenticationApiProperty } from "./authentication.constant.rdo";
import { UserRdo } from "./rdo/user.rdo";
import { LoggedUserRdo } from "./rdo/logged-user.rdo";

export const AuthenticationUserMessage = {
  Exists: 'User with this email already exists',
  NotFound: 'User not found',
  WrongPassword: 'User password is wrong'
} as const;

export const USER_ID_NAME = 'userId';

export const AuthenticationApiParam = {
  UserId: {
    name: USER_ID_NAME,
    schema: AuthenticationApiProperty.User.Id
  }
} as const;

export const AuthenticationApiResponse = {
  UserCreated: {
    type: UserRdo,
    status: HttpStatus.CREATED,
    description: 'The new user has been successfully created.'
  },
  UserExist: {
    status: HttpStatus.CONFLICT,
    description: AuthenticationUserMessage.Exists
  },
  LoggedSuccess: {
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.'
  },
  LoggedError: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password or Login is wrong.'
  },
  UserFound: {
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found'
  },
  UserNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationUserMessage.NotFound
  }
} as const;

