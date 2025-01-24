import { XHeader } from '../types/x-header.enum';

export const ApiHeaderOption = {
  RequestId: {
    name: XHeader.RequestId,
    example: '2f31b19b-97eb-4305-877a-0b9be7faca8f',
    description: 'X-Request-Id',
    required: false
  },
  UserId: {
    name: XHeader.UserId,
    example: '658170cbb954e9f5b905ccf4',
    description: 'X-User-Id',
    required: false
  }
} as const;
