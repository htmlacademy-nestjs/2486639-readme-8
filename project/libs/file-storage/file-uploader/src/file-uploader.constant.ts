import { HttpStatus } from '@nestjs/common';

import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { FileApiProperty } from './file-uploader.constant.property';

export const FILE_KEY = 'file';

export const FileIdApiParam = {
  name: 'fileId',
  schema: FileApiProperty.Id
} as const;

export const FileUploaderFileApiBody = {
  schema: {
    type: 'object',
    properties: {
      [FILE_KEY]: {
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
    description: 'File not found.'
  },
  BadRequest: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request.'
  }
} as const;
