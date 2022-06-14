import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected override options: ConsoleLoggerOptions = {
    logLevels: ['log', 'error', 'warn', 'debug'],
  };

  constructor(context: string) {
    super(context);
  }

  public log(message: unknown, ...optionalParams: unknown[]): void {
    super.log(message, ...this.parseParams(optionalParams));
  }

  public warn(message: unknown, ...optionalParams: unknown[]): void {
    super.warn(message, ...this.parseParams(optionalParams));
  }

  public error(message: unknown, ...optionalParams: unknown[]): void {
    super.error(message, ...this.parseParams(optionalParams));
  }

  public fatal(message: unknown, ...optionalParams: unknown[]): void {
    super.error(message, ...this.parseParams(optionalParams));
  }

  private parseParams(params: unknown[]): unknown[] {
    return params;
  }
}
