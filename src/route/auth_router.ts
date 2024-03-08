import express from 'express';
import { AUTH_PATH } from '../settings';

const AuthRouter = express.Router();

// Login route
AuthRouter.post(`/login`, (req, res) => {
    // Handle login logic here
});

// Register route
AuthRouter.post(`/register`, (req, res) => {
    // Handle register logic here
});

export default AuthRouter;