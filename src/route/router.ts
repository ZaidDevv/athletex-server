import { Router } from 'express';
import { AUTH_PATH, WORKOUT_RESOURCE } from '../settings';
import AuthRouter from './auth_router';
import WorkoutRouter from './workout_router';
import authenticated from '../middleware/middleware';

// Create a new router
const router = Router();

router.use(AUTH_PATH, AuthRouter);

router.use(WORKOUT_RESOURCE, WorkoutRouter);

export default router;