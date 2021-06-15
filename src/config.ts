import dotenv from 'dotenv';

dotenv.config();

const HALF_OF_YEAR = 180 * 24 * 60 * 60 * 1000;

export default {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExp: process.env.ACCESS_TOKEN_EXP || '25m',
  refreshTokenExp: Number(process.env.REFRESH_TOKEN_EXP) || HALF_OF_YEAR,
};
