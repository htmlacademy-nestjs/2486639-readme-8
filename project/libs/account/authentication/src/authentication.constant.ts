import { HttpStatus } from "@nestjs/common";

import { UserApiProperty } from "./authentication.constant.property";
import { UserRdo } from "./rdo/user.rdo";
import { LoggedUserRdo } from "./rdo/logged-user.rdo";

export const AuthenticationUserMessage = {
  Exists: 'User with this email already exists',
  NotFound: 'User not found',
  WrongPassword: 'User password is wrong'
} as const;

export const UserValidation = {
  name: {
    minLength: 3,
    maxLength: 50
  },
  password: {
    minLength: 6,
    maxLength: 12
  }
} as const;

export const AuthenticationValidateMessage = {
  name: {
    minLength: { message: `Minimum name length must be ${UserValidation.name.minLength}` },
    maxLength: { message: `Maximum name length must be ${UserValidation.name.maxLength}` }
  },
  email: {
    invalidFormat: { message: 'The email must be a valid email address' }
  },
  password: {
    minLength: { message: `Minimum password length must be ${UserValidation.password.minLength}` },
    maxLength: { message: `Maximum password length must be ${UserValidation.password.maxLength}` }
  }
} as const;

export const UserIdApiParam = {
  name: 'userId',
  schema: UserApiProperty.Id
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

