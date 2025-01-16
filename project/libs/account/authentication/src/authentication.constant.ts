import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

import { UserApiProperty } from './authentication.constant.property';
import { UserRdo } from './rdo/user.rdo';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UserTokenRdo } from './rdo/user-token.rdo';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';

export const AuthenticationUserMessage = {
  Exists: 'User with this email already exists.',
  NotFound: 'User not found.',
  WrongPassword: 'User password is wrong.',
  RequireLogout: 'Require logout.'
} as const;

export const AvatarOption = {
  KEY: 'avatarFile',
  MAX_SIZE: 500 * 1024,
  MIME_TYPES: ['image/jpg', 'image/jpeg', 'image/png']
} as const;

export const UserValidation = {
  Name: {
    MinLength: 3,
    MaxLength: 50
  },
  Password: {
    MinLength: 6,
    MaxLength: 12
  },
  AvatarFile: {
    Type: { fileType: AvatarOption.MIME_TYPES.join('|') },
    MaxSize: { maxSize: AvatarOption.MAX_SIZE },
    Build: {
      fileIsRequired: UserApiProperty.AvatarFile.required,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }
  }
} as const;

export const parseFilePipeBuilder =
  new ParseFilePipeBuilder()
    .addFileTypeValidator(UserValidation.AvatarFile.Type)
    .addMaxSizeValidator(UserValidation.AvatarFile.MaxSize)
    .build(UserValidation.AvatarFile.Build)

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
  RefreshTokens: {
    type: UserTokenRdo,
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens.'
  },
  Unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.'
  },
  NotAllow: {
    status: HttpStatus.FORBIDDEN,
    description: AuthenticationUserMessage.RequireLogout
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  },
  LoggedSuccess: {
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.'
  },
  LogoutSuccess: {
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully logout.'
  },
  CheckSuccess: {
    type: TokenPayloadRdo,
    status: HttpStatus.OK,
    description: 'Check access token success.'
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

