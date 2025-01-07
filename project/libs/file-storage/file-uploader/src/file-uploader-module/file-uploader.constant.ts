import { HttpStatus } from '@nestjs/common';

import { UploadedFileRdo } from './rdo/uploaded-file.rdo';

/*
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
*/

export const FileIdApiParam = {
  name: 'fileId',
  schema: {}//!UserApiProperty.Id
} as const;

export const FileUploaderFileApiBody = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary'
      }
    }
  }
};

export const FileUploaderApiResponse = {
  FileUploaded: {
    type: UploadedFileRdo,
    status: HttpStatus.CREATED,
    description: 'The new file has been successfully upload.'
  },
  FileFound: {
    type: UploadedFileRdo,
    status: HttpStatus.OK,
    description: 'File found.'
  },
  FileNotFound: {
    status: HttpStatus.NOT_FOUND,
    //description: AuthenticationUserMessage.NotFound
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    //description: AuthenticationUserMessage.NotFound
  }
} as const;
