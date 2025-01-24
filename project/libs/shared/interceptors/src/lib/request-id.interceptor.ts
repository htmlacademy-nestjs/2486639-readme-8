import * as crypto from 'crypto';
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { RequestProperty } from '@project/shared/core';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = crypto.randomUUID();
    const request = context.switchToHttp().getRequest<Request>();

    request[RequestProperty.RequestId] = requestId;
    Logger.log(`${request.method}: ${request.url}: ${RequestProperty.RequestId} is ${requestId || 'empty'}`, RequestIdInterceptor.name);

    return next.handle();
  }
}
