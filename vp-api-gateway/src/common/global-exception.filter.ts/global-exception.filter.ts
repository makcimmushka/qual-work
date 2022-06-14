import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerService } from '../logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const url = httpAdapter.getRequestUrl(request);
    const method = httpAdapter.getRequestMethod(request);

    const reason =
      exception instanceof Error ? exception.message : `${exception}`;

    this.logger.error(
      `Failed to process request ${method} ${url} because of ${reason}`,
    );

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Error
        ? exception.message
        : 'Refer to application logs for error details';

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
