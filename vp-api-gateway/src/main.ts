import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';
import { registerGracefulShutdown } from './common/graceful-shutdown';

async function bootstrap() {
  registerGracefulShutdown();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const details: string[] = [];
        for (const error of errors) {
          if (!error.constraints) continue;
          for (const constraint of Object.values(error.constraints)) {
            details.push(constraint);
          }
        }
        return new BadRequestException(`Bad Request: ${details.join(',')}`);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  const SERVER_PORT = config.get<number>('SERVER_PORT');

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  await app.startAllMicroservices();

  await app.listen(SERVER_PORT, () => {
    logger.log(`app is listening on port ${SERVER_PORT}`);
  });
}
bootstrap();
