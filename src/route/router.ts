import { Router } from 'express';
import { AUTH_PATH, WORKOUT_RESOURCE } from '../settings';
import AuthRouter from './auth_router';
import WorkoutRouter from './workout_router';
import logger from '../logger';

// Create a new router
const router = Router();

// index route
router.get('/', (req, res) => {
    logger.info('Welcome to the athletex tracker API');
    res.send('Welcome to the athletex tracker API');
});

router.use(AUTH_PATH, AuthRouter);

router.use(WORKOUT_RESOURCE, WorkoutRouter);

export default router;