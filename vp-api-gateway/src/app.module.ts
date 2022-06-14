import { Module } from '@nestjs/common';
import { configuration } from './common/config';
import { LoggerModule } from './common/logger';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { UserModule } from './module/user';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/global-exception.filter.ts';
import { AuthModule } from './module/auth';
import { AuthGuard } from './common/guard';
import { RequestModule } from './module/request';
import { LoggingInterceptor } from './common/interceptor';
import { RedisModule } from './module/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrometheusModule.register(),
    LoggerModule,
    UserModule,
    AuthModule,
    RequestModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AuthGuard,
  ],
})
export class AppModule {
  constructor() {
    //
  }
}
