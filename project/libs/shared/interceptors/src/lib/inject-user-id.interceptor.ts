import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { RequestProperty, XHeader } from '@project/shared/core';

@Injectable()
export class InjectUserIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.headers[XHeader.UserId];

    request[RequestProperty.UserId] = userId; //  можно доделать валидацию по GuidValidationPipe
    Logger.log(`[InjectUserIdInterceptor: ${request.method}: ${request.url}]: ${RequestProperty.UserId}: ${userId || 'empty'}`);

    return next.handle();
  }
}
