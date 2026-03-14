import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  sessionTtl: process.env.SESSION_TTL || '30d',

  bcryptCost: Number(process.env.BCRYPT_COST || 12),
}));