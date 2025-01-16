import * as crypto from 'crypto';
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { xHeader } from '@project/shared/core';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = crypto.randomUUID();
    const request = context.switchToHttp().getRequest<Request>();

    request.headers[xHeader.RequestId] = requestId;
    Logger.log(`[${request.method}: ${request.url}]: RequestID is ${requestId}`);

    return next.handle();
  }
}
