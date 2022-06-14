export const configuration = () => ({
  SERVER_PORT: parseInt(process.env.SERVER_PORT || '6007'),
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'jwt-secret-key',
});
