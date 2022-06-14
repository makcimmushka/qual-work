import { Logger } from '@nestjs/common';

/* eslint-disable no-process-exit */
export const registerGracefulShutdown = () => {
  process.on('uncaughtException', handleUncaughtException);
  process.on('unhandledRejection', handlePromiseRejection);
  process.on('SIGTERM', handleSigterm);
  process.on('SIGINT', handleSigint);
  Logger.log('graceful shutdown registered');
};

export const handleUncaughtException = (err: any) => {
  Logger.error(`Uncaught exception occurred: ${err}`);
  process.exit(1);
};

export const handlePromiseRejection = (reason: any) => {
  Logger.error(`Unhandled promise rejection occurred: ${reason}`);
  process.exit(1);
};

export const handleSigterm = (signal: any) => {
  Logger.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
};

export const handleSigint = (signal: any) => {
  Logger.log(`Process ${process.pid} has been interrupted`);
  process.exit(0);
};
