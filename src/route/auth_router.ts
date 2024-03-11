import express from 'express';
import { AuthController } from '../controller/auth_controller';

const AuthRouter = express.Router();

/**
 * @swagger
 * components:
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized. The user's credentials are invalid or the token is expired/invalid.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the response.
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 description: A message indicating the status of the request.
 *                 example: "Invalid credentials, or expired/invalid token!"
 *     NotFound:
 *       description: Not Found. The resource was not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the response.
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 description: A message indicating the status of the request.
 *                 example: "resource not found!"
 *     UnprocessableEntity:
 *       description: Invalid request body. Please check the provided body.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the response.
 *                 example: "error"
 *               message:
 *                 type: string
 *                 description: A message indicating the status of the request.
 *                 example: "Invalid request body, Please check the provided body!"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: "test@hotmail.com"
 *         DOB:
 *           type: string
 *           description: The date of birth of the user.
 *           example: "1990-01-01"
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: "johndoe"
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The user's access token.
 *         refreshToken:
 *           type: string
 *           description: The user's refresh token.
 */


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in a user.
 *     description: Log in a user using their username or email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: "test@email.com"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password"
 *     responses:
 *       200:
 *         description: A successful response. Returns the user's authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the request.
 *                   example: "User logged in successfully!"
 *       401:
 *        $ref: '#/components/responses/Unauthorized'
 *       404:
 *        $ref: '#/components/responses/NotFound'
 *       422:
 *        $ref: '#/components/responses/UnprocessableEntity'
 * 
 */
AuthRouter.post(`/login`, AuthController.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user.
 *     description: Register a new user using their full name, email, date of birth, username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: "test@email.com"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password"
 *               fullName:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: "John Doe"
 *               DOB:
 *                 type: string
 *                 description: The date of birth of the user.
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: successfully created response. Returns the user & tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the request.
 *                   example: "User registered successfully!"
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 */
AuthRouter.post(`/register`, AuthController.register);


/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh a user's access token.
 *     description: Refresh a user's access token using their refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token of the user.
 *     responses:
 *       200:
 *         description: A successful response. Returns the user's new access token & refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       $ref: '#/components/schemas/Tokens'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 */

// Refresh token route
AuthRouter.post(`/refresh`, AuthController.refreshToken);


export default AuthRouter;