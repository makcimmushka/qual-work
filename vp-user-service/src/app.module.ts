import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './common/config';
import { LoggerModule } from './common/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { UserEntity } from './domain/entity';
import { UserModule } from './module/user';
import { HelperModule } from './module/helper';
import { AuthModule } from './module/auth';
import { RedisModule } from './module/redis';

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
          entities: [UserEntity],
          retryAttempts: config.get<number>('POSTGRES_RETRY_ATTEMPTS'),
          retryDelay: config.get<number>('POSTGRES_RETRY_DELAY_IN_MS'),
        };
      },
      inject: [ConfigService],
    }),
    PrometheusModule.register(),
    LoggerModule,
    UserModule,
    HelperModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    //
  }
}
