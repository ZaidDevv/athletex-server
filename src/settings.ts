import dotenv from 'dotenv';

dotenv.config();

const BASE_PREFIX = "/api/v1";

export const AUTH_PATH = `${BASE_PREFIX}/auth`;

export const WORKOUT_RESOURCE = `${BASE_PREFIX}/workout`;

export const USER_RESOURCE = `${BASE_PREFIX}/user`;

export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';

export const DATABASE_NAME = process.env.DATABASE_NAME || 'athletex';

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_ACCESS_EXPIRATION = process.env.ACCESS_JWT_EXPIRATION|| '2d';

export const JWT_REFRESH_EXPIRATION = process.env.REFRESH_JWT_EXPIRATION || '20d';

export const EXERCISE_COLLECTION = 'exercises';

export const USER_COLLECTION = 'users';

export const WORKOUT_COLLECTION = 'workouts';

