import express from 'express';
import { AuthController } from '../controller/auth_controller';

const AuthRouter = express.Router();

// Login route
AuthRouter.post(`/login`, AuthController.login);

// Registration route
AuthRouter.post(`/register`, AuthController.register);

export default AuthRouter;