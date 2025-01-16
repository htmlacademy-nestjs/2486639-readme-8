import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResponse = {
      message: INTERNAL_SERVER_ERROR_MESSAGE,
      error: INTERNAL_SERVER_ERROR_MESSAGE,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    };

    // для отладки
    console.log(exception);
    //Logger.error(exception, 'AnyExceptionFilter');

    response
      .status(errorResponse.statusCode)
      .json(errorResponse);
  }
}
