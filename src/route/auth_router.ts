import express from 'express';
import { AUTH_PATH } from '../settings';

const AuthRouter = express.Router();

// Login route
AuthRouter.post(`${AUTH_PATH}/login`, (req, res) => {
    // Handle login logic here
});

// Register route
AuthRouter.post(`${AUTH_PATH}/register`, (req, res) => {
    // Handle register logic here
});

export default AuthRouter;