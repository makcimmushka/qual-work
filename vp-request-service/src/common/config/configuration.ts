export const configuration = () => ({
  SERVER_PORT: parseInt(process.env.SERVER_PORT || '6666'),

  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '54322'),
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'qwerty',
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'postgres',
  POSTGRES_CONNECTION_TIMEOUT_MS: parseInt(
    process.env.POSTGRES_CONNECTION_TIMEOUT_MS || '1000',
  ),
  POSTGRES_MAX_QUERY_EXECUTION_TIME: parseInt(
    process.env.POSTGRES_MAX_QUERY_EXECUTION_TIME || '20000',
  ),
  POSTGRES_RETRY_ATTEMPTS: parseInt(process.env.POSTGRES_RETRY_ATTEMPTS || '5'),
  POSTGRES_RETRY_DELAY_IN_MS: parseInt(
    process.env.POSTGRES_RETRY_DELAY_IN_MS || '2000',
  ),

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'jwt-secret-key',
});
