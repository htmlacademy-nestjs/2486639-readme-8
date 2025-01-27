import { XHeader } from '../types/x-header.enum';
import { ApiPropertyOption } from './api-property-option';

export const ApiHeaderOption = {
  RequestId: {
    name: XHeader.RequestId,
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f',
    description: 'X-Request-Id',
    required: false
  },
  UserId: {
    name: XHeader.UserId,
    example: ApiPropertyOption.User.Id.example,
    description: 'X-User-Id',
    required: false
  }
} as const;
