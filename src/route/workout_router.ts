import express from 'express';
import { Request, Response } from 'express';

const WorkoutRouter = express.Router();

// Generate Workout
WorkoutRouter.post(`/generate`, (req: Request, res: Response) => {

});

// Get all workouts
WorkoutRouter.get(`/`, (req: Request, res: Response) => {

});

// Get workout by id
WorkoutRouter.get(`/:id`, (req: Request, res: Response) => {

});


// Delete workout by id
WorkoutRouter.delete(`/:id`, (req: Request, res: Response) => {

});

export default WorkoutRouter;