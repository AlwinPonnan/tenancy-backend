import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    // Handle known HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const res = exceptionResponse as any;
        message = res.message;
      }
    }

    // Log full error details for debugging
    console.error('----- Exception Occurred -----');
    console.error('Time:', new Date().toISOString());
    console.error('Method:', request.method);
    console.error('URL:', request.url);
    console.error('IP:', request.ip);
    console.error('User-Agent:', request.headers['user-agent']);

    if (exception instanceof Error) {
      console.error('Stack Trace:', exception.stack);
    } else {
      console.error('Exception:', exception);
    }

    console.error('------------------------------');

    // Send sanitized response
    response.status(status).json({
      statusCode: status,
      message,
      error: status === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_FAILED',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}