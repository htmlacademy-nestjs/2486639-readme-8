import { HttpStatus } from '@nestjs/common';

import { UserApiProperty } from './authentication.constant.property';
import { UserRdo } from './rdo/user.rdo';
import { LoggedUserRdo } from './rdo/logged-user.rdo';

export const AuthenticationUserMessage = {
  Exists: 'User with this email already exists',
  NotFound: 'User not found',
  WrongPassword: 'User password is wrong'
} as const;

export const UserValidation = {
  Name: {
    MinLength: 3,
    MaxLength: 50
  },
  Password: {
    MinLength: 6,
    MaxLength: 12
  }
} as const;

export const AuthenticationValidateMessage = {
  Name: {
    MinLength: { message: `Minimum name length must be ${UserValidation.Name.MinLength}` },
    MaxLength: { message: `Maximum name length must be ${UserValidation.Name.MaxLength}` }
  },
  Email: {
    InvalidFormat: { message: 'The email must be a valid email address' }
  },
  Password: {
    MinLength: { message: `Minimum password length must be ${UserValidation.Password.MinLength}` },
    MaxLength: { message: `Maximum password length must be ${UserValidation.Password.MaxLength}` }
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
  NotAllow: {
    status: HttpStatus.FORBIDDEN,
    description: 'Require logout.'
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
    description: 'User found.'
  },
  UserNotFound: {
    status: HttpStatus.NOT_FOUND,
    description: AuthenticationUserMessage.NotFound
  }
} as const;

