import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './common/config';
import { LoggerModule } from './common/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RequestEntity } from './domain/entity';
import { RequestModule } from './module/request';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('POSTGRES_HOST'),
          port: config.get<number>('POSTGRES_PORT'),
          username: config.get<string>('POSTGRES_USER'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          connectTimeoutMS: config.get<number>(
            'POSTGRES_CONNECTION_TIMEOUT_MS',
          ),
          maxQueryExecutionTime: config.get<number>(
            'POSTGRES_MAX_QUERY_EXECUTION_TIME',
          ),
          synchronize: true,
          autoLoadEntities: false,
          entities: [RequestEntity],
          retryAttempts: config.get<number>('POSTGRES_RETRY_ATTEMPTS'),
          retryDelay: config.get<number>('POSTGRES_RETRY_DELAY_IN_MS'),
        };
      },
      inject: [ConfigService],
    }),
    PrometheusModule.register(),
    LoggerModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    //
  }
}
