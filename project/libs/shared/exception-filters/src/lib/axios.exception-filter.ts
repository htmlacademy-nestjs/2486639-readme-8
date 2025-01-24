import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

import { parseAxiosError } from '@project/shared/helpers';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost): void {
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

    Logger.error(parseAxiosError(error), AxiosExceptionFilter.name);

    response
      .status(errorResponse.statusCode)
      .json(errorResponse);
  }
}
