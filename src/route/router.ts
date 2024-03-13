import { Router } from 'express';
import { AUTH_PATH, EXERCISE_RESOURCE, WORKOUT_RESOURCE } from '../settings';
import AuthRouter from './auth_router';
import WorkoutRouter from './workout_router';
import wLogger from '../logger';
import path from 'path';
import { authenticated } from '../middleware/middleware';
import Exercise from '../model/exercise';
import ExerciseRouter from './exercise_router';

// Create a new router
const router = Router();

const logger = wLogger({logName: 'router', level: 'silly'});

// index route
router.get('/', (req, res) => {
    logger.info('Welcome to the athletex tracker API');
    res.send('Welcome to the athletex tracker API');
});
router.get('/dashboard', authenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'form', 'dashboard.html'));
});
router.use(AUTH_PATH, AuthRouter);

router.use(WORKOUT_RESOURCE, WorkoutRouter);

router.use(EXERCISE_RESOURCE,ExerciseRouter)

export default router;