import dotenv from 'dotenv';

dotenv.config();

const BASE_PREFIX = "/api";

export const AUTH_PATH = `${BASE_PREFIX}/auth`;

export const WORKOUT_RESOURCE = `${BASE_PREFIX}/workout`;

export const USER_RESOURCE = `${BASE_PREFIX}/user`;

export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION) || 7200 as number; // 1 hour default

export const EXERCISE_COLLECTION = 'exercises';

export const USER_COLLECTION = 'users';

export const WORKOUT_COLLECTION = 'workouts';
export interface IResponseSchema {
    status: ResponseStatus;
    data?: any;
    message?: string;
}
export enum ResponseStatus {
    SUCCESS = "success",
    ERROR = "error",
    FAIL = "fail"
}

