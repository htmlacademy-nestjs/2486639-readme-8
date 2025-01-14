import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = error.response?.statusText || INTERNAL_SERVER_ERROR_MESSAGE;
    const message = error.response?.data['message'] || INTERNAL_SERVER_ERROR_MESSAGE;

    response
      .status(statusCode)
      .json({
        message,
        error: errorMessage,
        statusCode
      });
  }
}
