import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    Logger.error(error);
    if (typeof error === 'string') {
      return of({ message: error, status: 500 });
    }
    return of({
      message: (error as any).message || 'Something went wrong',
      status: (error as any).status,
    });
  }
}
