export enum XHeader {
  RequestId = 'x-request-id',
  UserId = 'x-user-id'
};

export const BlogRequestIdApiHeader = {
  name: XHeader.RequestId,
  example: '2f31b19b-97eb-4305-877a-0b9be7faca8f',
  description: 'X-Request-Id',
  required: false
} as const;

export const BlogUserIdApiHeader = {
  name: XHeader.UserId,
  example: '658170cbb954e9f5b905ccf4',
  description: 'X-User-Id',
  required: false
} as const;
