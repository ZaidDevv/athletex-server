import express from 'express';
import { authenticated } from '../middleware/middleware';
import { WorkoutController } from '../controller/workout_controller';

const WorkoutRouter = express.Router();

WorkoutRouter.use(authenticated);
/**
 * @swagger
 * components:
 *   schemas:
 *     PositionEnum:
 *       type: string
 *       required: true
 *       enum:
 *         - Guard
 *         - Forward
 *         - Center
 *         - All
 *       description: The position of the player on the court
 *     EquipmentEnum:
 *       type: string
 *       required: true
 *       enum:
 *         - Basketball
 *         - Cones
 *         - Resistance Bands
 *         - Jump Rope
 *         - Medicine Ball
 *         - Weights
 *         - Hoop
 *         - None
 *       description: The equipment needed for the exercise
 *     ExerciseCategoryEnum:
 *       type: string
 *       required: true
 *       enum:
 *         - Shooting
 *         - Dribbling
 *         - Defending
 *         - Passing
 *         - Rebounding
 *         - Blocking
 *         - Stealing
 *         - Free Throw
 *         - Three Point Shooting
 *         - Two Point Shooting
 *       description: The category of the exercise
 *     Exercise:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the exercise
 *         category:
 *           $ref: '#/components/schemas/ExerciseCategoryEnum'
 *           description: The category of the exercise
 *         duration:
 *           type: number
 *           example: 20
 *           description: The duration of the exercise in minutes
 *         reps:
 *           type: number
 *           example: 10
 *           description: The number of repetitions for the exercise
 *         sets:
 *           type: number
 *           example: 3
 *           description: The number of sets for the exercise
 *         restPeriod:
 *           type: number
 *           example: 2
 *           description: The rest period between sets in seconds
 *         skillLevel:
 *           type: string
 *           enum:
 *             - Beginner
 *             - Intermediate
 *             - Advanced
 *           description: The skill level required for the exercise
 *         positionFocus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PositionEnum'
 *           description: The positions that might benefit from the exercise
 *         equipmentNeeded:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentEnum'
 *           description: The equipment needed for the exercise
 *     Workout:
 *       type: object
 *       properties:
 *         duration:
 *           type: number
 *           example: 30
 *           description: The duration of the workout in minutes
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExerciseCategoryEnum'
 *           description: The categories of exercises included in the workout
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: The exercises included in the workout
 *         skillLevel:
 *           type: string
 *           enum:
 *             - Beginner
 *             - Intermediate
 *             - Advanced
 *           description: The skill level required for the workout
 *         positionFocus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PositionEnum'
 *           description: The positions that might benefit from the workout
 *         equipmentNeeded:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentEnum'
 *           description: The equipment needed for the workout
 *     WorkoutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the response
 *           example: "success"
 *         data:
 *           $ref: '#/components/schemas/Workout'
 *           description: The generated workout
 *
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
WorkoutRouter.post(`/generate`, WorkoutController.generateWorkout);

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
WorkoutRouter.get(`/`, WorkoutController.getWorkouts);

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
WorkoutRouter.get(`/:id`, WorkoutController.getWorkoutById);

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
WorkoutRouter.delete(`/:id`, WorkoutController.deleteWorkout);

export default WorkoutRouter;