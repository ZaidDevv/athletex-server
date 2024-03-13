import express from "express";
import { authenticated } from "../middleware/middleware";
import { ExerciseController } from "../controller/exercise_controller";
import Exercise from "../model/exercise";

const ExerciseRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exercise
 *   description: Exercise routes
 * components:
 *  $ref: '../docs/global.yaml#/components'
 */

ExerciseRouter.use(authenticated);

ExerciseRouter.post('/', ExerciseController.insertExercise);

/**
 * @swagger
 * /api/v1/exercise:
 *   get:
 *     tags:
 *       - Exercise
 *     summary: Get all exercises
 *     description: Get all exercises
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
ExerciseRouter.get('/', ExerciseController.getExercises);

/**
 * @swagger
 * /api/v1/exercise/{id}:
 *   get:
 *     tags:
 *      - Exercise
 *     summary: Get an exercise by ID
 *     description: Get a specific exercise by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/responses/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Exercise'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
ExerciseRouter.get('/:id', ExerciseController.getExercise);
/**
 * @swagger
 * /api/v1/exercise/{id}:
 *   put:
 *     tags:
 *      - Exercise
 *     summary: Update an exercise by ID
 *     description: Update a specific exercise by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../docs/global.yaml#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 */
ExerciseRouter.put('/:id', ExerciseController.updateExercise);

/**
 * @swagger
 * /api/v1/exercise/{id}:
 *   delete:
 *     tags:
 *       - Exercise
 *     summary: Delete an exercise by ID
 *     description: Delete a specific exercise by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
ExerciseRouter.delete('/:id', ExerciseController.deleteExercise);

export default ExerciseRouter;
