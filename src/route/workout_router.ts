import express from 'express';
import { authenticated } from '../middleware/middleware';
import { WorkoutController } from '../controller/workout_controller';

const WorkoutRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workout
 *   description: Workout routes
 * components:
 *  $ref: '../docs/global.yaml#/components'
 */

/*
 * /api/v1/workout/generate:
 *   post:
 *     summary: Generate a workout
 *     description: Generate a workout based on the time allocated and exercise categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timeAllocated:
 *                 type: number
 *                 required: true
 *                 description: The time allocated for the workout in minutes
 *                 example: 30
 *               exerciseCategories:
 *                 type: array
 *                 required: true
 *                 items:
 *                   $ref: '#/components/schemas/ExerciseCategoryEnum'
 *                 description: The categories of exercises to include in the workout
 *        
 *     responses:
 *       200:
 *         description: A successful response. Returns the generated workout.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutResponse'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *     tags:
 *       - Workout
 *     security:
 *       - bearerAuth: []
 */
WorkoutRouter.post(`/generate`,authenticated(false), WorkoutController.generateWorkout);

/**
 * @swagger
 * /api/v1/workout:
 *   get:
 *     summary: Get all workouts
 *     tags:
 *       - Workout
 *     responses:
 *       200:
 *         description: A successful response. Returns all workouts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutResponse'
 *     security:
 *       - bearerAuth: []
 */
WorkoutRouter.get(`/`,authenticated(true),WorkoutController.getWorkouts);

/**
 * @swagger
 * /api/v1/workout/{id}:
 *   get:
 *     summary: Get workout by id
 *     tags:
 *       - Workout
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       404:
 *         $ref: '#/components/responses/NotFound'    
 *       200:
 *         description: A successful response. Returns the workout with the specified id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutResponse'
 *     security:
 *       - bearerAuth: []
 */
WorkoutRouter.get(`/:id`, authenticated(false), WorkoutController.getWorkoutById);

/**
 * @swagger
 * /api/v1/workout/{id}:
 *   delete:
 *     summary: Delete workout by id
 *     tags:
 *       - Workout
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the workout to delete
 *         schema:
 *           type: string
 *     responses:
 *       404:
 *         $ref: '#/components/responses/NotFound'    
 *       200:
 *         description: A successful response. The workout with the specified id was deleted.
 *     security:
 *       - bearerAuth: []
 */
WorkoutRouter.delete(`/:id`, authenticated(false), WorkoutController.deleteWorkout);

export default WorkoutRouter;