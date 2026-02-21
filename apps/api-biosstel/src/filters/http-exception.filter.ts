import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/** Formato estándar de error para todas las respuestas HTTP de error */
export interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path?: string;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.getExceptionMessage(exception)
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorName =
      exception instanceof HttpException
        ? exception.name
        : exception instanceof Error
          ? exception.constructor.name
          : 'Error';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status}`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    const body: ErrorResponseBody = {
      statusCode: status,
      message,
      error: errorName,
      path: request.url,
    };

    response.status(status).json(body);
  }

  private getExceptionMessage(exception: HttpException): string | string[] {
    const res = exception.getResponse();
    if (typeof res === 'object' && res !== null && 'message' in res) {
      const msg = (res as { message?: string | string[] }).message;
      if (msg !== undefined) return msg;
    }
    return exception.message;
  }
}
