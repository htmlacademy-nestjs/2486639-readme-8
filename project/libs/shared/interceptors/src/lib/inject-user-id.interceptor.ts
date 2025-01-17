import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RequestProperty } from '@project/shared/core';

@Injectable()
export class InjectUserIdInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    request[RequestProperty.UserId] = userId;
    Logger.log(`[${request.method}: ${request.url}]: UserID is ${userId}`);

    return next.handle();
  }
}
