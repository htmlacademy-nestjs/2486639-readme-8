import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { RequestProperty, XHeader } from '@project/shared/core';

@Injectable()
export class InjectRequestIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.headers[XHeader.RequestId];

    request[RequestProperty.RequestId] = requestId; // можно доделать валидацию по MongoIdValidationPipe
    Logger.log(`[InjectRequestIdInterceptor: ${request.method}: ${request.url}]: ${RequestProperty.RequestId}: ${requestId || 'empty'}`);

    return next.handle();
  }
}
