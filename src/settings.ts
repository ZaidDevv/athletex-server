import dotenv from 'dotenv';

dotenv.config();

const BASE_PREFIX = "/api";

export const AUTH_PATH = `${BASE_PREFIX}/auth`;

export const WORKOUT_RESOURCE = `${BASE_PREFIX}/workout`;

export const USER_RESOURCE = `${BASE_PREFIX}/user`;

export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';

export const PORT = process.env.PORT;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export const EXERCISE_COLLECTION = 'exercises';

export const USER_COLLECTION = 'users';

export const WORKOUT_COLLECTION = 'workouts';
