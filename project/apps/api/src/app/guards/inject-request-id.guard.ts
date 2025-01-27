import * as crypto from 'crypto';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { RequestProperty } from '@project/shared/core';

@Injectable()
export class InjectRequestIdGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestId = crypto.randomUUID();
    const request = context.switchToHttp().getRequest<Request>();

    request[RequestProperty.RequestId] = requestId;
    Logger.log(`${request.method}: ${request.url}: generated ${RequestProperty.RequestId}: ${requestId}`, InjectRequestIdGuard.name);

    return true;
  }
}
