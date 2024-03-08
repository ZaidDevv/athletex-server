
import express, { Request, Response, NextFunction } from 'express';
import app from '../app';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware to check if the request is authenticated
const authenticated = app.use((req: Request, res: Response, next: NextFunction) => {
    // Add your authentication logic here
    // For example, you can check if the request contains a valid JWT token

    // If the request is authenticated, call `next()` to proceed to the next middleware
    // If the request is not authenticated, return an error response
    if (req.headers.authorization) {
        // Your authentication logic here
        // Example: verify JWT token
        // If the token is valid, call `next()`
        // If the token is invalid, return an error response
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

export default authenticated;