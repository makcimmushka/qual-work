import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';
import { registerGracefulShutdown } from './common/graceful-shutdown';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  registerGracefulShutdown();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'vp-request-service',
          brokers: [`localhost:9092`],
        },
        consumer: {
          groupId: 'vp-request-service-consumer',
        },
      },
    },
  );

  const config = app.get(ConfigService);
  const SERVER_PORT = config.get<number>('SERVER_PORT');

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  await app.listen();
  logger.log(`app is listening on port ${SERVER_PORT}`);
}
bootstrap();
