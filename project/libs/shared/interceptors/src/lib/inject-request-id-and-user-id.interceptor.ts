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

    request[RequestProperty.RequestId] = requestId; // можно доделать валидацию по MongoIdValidationPipe
    request[RequestProperty.UserId] = userId; //  можно доделать валидацию по GuidValidationPipe

    if (requestId) {
      Logger.log(`[${request.method}: ${request.url}]: ${XHeader.RequestId}: ${requestId}`);
    }

    if (userId) {
      Logger.log(`[${request.method}: ${request.url}]: ${XHeader.UserId}: ${userId}`);
    }

    return next.handle();
  }
}
