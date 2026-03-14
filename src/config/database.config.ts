import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbMaxConnections: process.env.DB_MAX_CONNECTIONS,
}));

// DB_PORT=5432
// DB_USER=postgres
// DB_PASSWORD=postgres
// DB_NAME=tenancy