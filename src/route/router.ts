import { Router } from 'express';
import { AUTH_PATH, WORKOUT_RESOURCE } from '../settings';
import app from '../app';
import AuthRouter from './auth_router';
import WorkoutRouter from './workout_router';

app.use(AUTH_PATH, AuthRouter);

app.use(WORKOUT_RESOURCE, WorkoutRouter);
