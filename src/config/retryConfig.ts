import { registerAs } from '@nestjs/config';

export default registerAs('retry', () => ({
  RETRY_COUNT: Number(process.env.RETRY_COUNT),
}));

// DB_PORT=5432
// DB_USER=postgres
// DB_PASSWORD=postgres
// DB_NAME=tenancy