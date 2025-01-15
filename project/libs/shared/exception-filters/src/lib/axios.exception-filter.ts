import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

import { parseAxiosError } from '@project/shared/helpers';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResponse = {
      message: INTERNAL_SERVER_ERROR_MESSAGE,
      error: INTERNAL_SERVER_ERROR_MESSAGE,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    };

    if (error.response) {
      const { status, statusText, data } = error.response;
      const message = data['message'];

      errorResponse.statusCode = status;
      errorResponse.error = statusText;

      if (message) {
        errorResponse.message = message;
      }
    }

    //console.log(error); //! в лог еще бы URL исходный, где то в error.request._currentUrl
    /*
    if (error.cause) {
      const errors = error.cause['errors'];

      Logger.error(errors, 'AxiosExceptionFilter');
    }

    Logger.error(errorResponse, 'AxiosExceptionFilter Response');
    */
    //! другой вариант - логировать все
    Logger.error(parseAxiosError(error), 'AxiosExceptionFilter');

    response
      .status(errorResponse.statusCode)
      .json(errorResponse);
  }
}
