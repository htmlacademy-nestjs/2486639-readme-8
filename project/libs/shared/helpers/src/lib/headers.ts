import { XHeader } from '@project/shared/core';

export const AUTH_NAME = 'authorization';

type XHeaders = { headers: { [XHeader.RequestId]: string, [AUTH_NAME]?: string, [XHeader.UserId]?: string } };

export function makeHeaders(requestId: string, authorization?: string, userId?: string): XHeaders {
  const headers = { [XHeader.RequestId]: requestId };

  if (authorization) {
    headers[AUTH_NAME] = authorization;
  }

  if (userId) {
    headers[XHeader.UserId] = userId;
  }

  return { headers };
}
