import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { EntityNotFoundError } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: WinstonLoggerService,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    this.handleException(exception, host);
  }

  exceptionHandlers: Record<
    string,
    (exception: any, host: ArgumentsHost) => void
  > = {
    EntityNotFoundError: (exception, host) =>
      this.handleEntityNotFoundError(exception, host),
    HttpException: (exception, host) =>
      this.handleHttpException(exception, host),
    ForbiddenException: (exception, host) =>
      this.handleForbiddenException(exception, host),
    UnauthorizedException: (exception, host) =>
      this.handleUnauthorizedException(exception, host),
  };

  handleException(exception: any, host: any): void {
    const handler = this.exceptionHandlers[exception.constructor.name];
    if (!handler) {
      this.handleUnknownException(exception, host);
      return;
    }

    handler(exception, host);
  }

  handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const lang = I18nContext.current()?.lang;

    const originalResponse = exception.getResponse();
    let message: any = originalResponse;

    if (
      status === 422 &&
      typeof originalResponse === 'object' &&
      originalResponse !== null &&
      'errors' in originalResponse
    ) {
      const errors = (originalResponse as any).errors;

      const translatedErrors = Object.entries(errors).reduce(
        (acc, [field, value]) => {
          if (typeof value === 'string') {
            acc[field] = value
              .split(',')
              .map((msg) => this.i18n.t(msg.trim(), { lang }) || msg.trim())
              .join(', ');
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      message = {
        status: 422,
        errors: translatedErrors,
      };
    }

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message,
      stack: exception.stack,
    });
  }

  private handleEntityNotFoundError(
    exception: EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.PRECONDITION_FAILED; // EntityNotFoundError is treated as 404

    this.logError(request, 'EntityNotFoundError', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.PRECONDITION_FAILED,
        errors: {
          entity: exception.message,
        },
      },
      stack: exception.stack,
    });
  }

  private handleUnauthorizedException(
    exception: EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED; // UnauthorizedException is treated as 401

    this.logError(request, 'UnauthorizedException', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.UNAUTHORIZED,
        errors: {
          entity: exception.message,
        },
      },
      stack: exception.stack,
    });
  }

  private handleForbiddenException(
    exception: ForbiddenException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logError(request, 'ForbiddenException', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.FORBIDDEN,
        errors: {
          auth: exception.message,
        },
      },
      stack: exception.stack,
    });
  }

  private handleUnknownException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unknown exceptions

    this.logError(request, 'UnknownException', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: {
          message: exception instanceof Error ? exception.message : 'Unknown',
        },
      },
      stack: exception instanceof Error ? exception.stack : null,
    });
  }

  private logError(
    request: Request,
    exceptionType: string,
    exception: unknown,
  ) {
    this.loggerService.error(request.url, {
      description: request.url,
      class: exceptionType,
      function: 'exception',
      exception,
    });
  }
}
