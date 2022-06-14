import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = ctx.switchToHttp();
    const request = httpCtx.getRequest();
    this.logger.log(`Incoming request: ${request.method} ${request.url}`);
    return next.handle();
  }
}
