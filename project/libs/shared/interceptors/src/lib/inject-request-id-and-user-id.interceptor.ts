import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { RequestProperty, XHeader } from '@project/shared/core';

@Injectable()
export class InjectRequestIdAndUserIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.headers[XHeader.RequestId];
    const userId = request.headers[XHeader.UserId];

    request[RequestProperty.RequestId] = requestId;
    request[RequestProperty.UserId] = userId;
    Logger.log(`[${request.method}: ${request.url}]: RequestID is ${requestId}`);
    Logger.log(`[${request.method}: ${request.url}]: UserID is ${userId}`);

    return next.handle();
  }
}
