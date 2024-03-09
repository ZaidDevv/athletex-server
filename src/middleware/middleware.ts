
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IResponseSchema, JWT_SECRET, ResponseStatus } from '../settings';

const middlewareRouter = express.Router();

middlewareRouter.use(express.json());

middlewareRouter.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware to check if the request is authenticated
export const authenticated = ((req: Request, res: Response, next: NextFunction) => {
    let response: IResponseSchema;
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // verify the token
            const verified = jwt.verify(token, JWT_SECRET);

            if (!verified) {
                response = {
                    status: ResponseStatus.FAIL,
                    message: 'Unauthorized, Token is invalid or has expired!',
                };
                res.status(401).json(response);
                return;
            }

            next();
        }
        catch (e) {
            response = {
                status: ResponseStatus.ERROR,
                message: 'Unauthorized, Token is invalid or has expired!',
            };
            res.status(401).json(response);
        }
    }
    else {
        response = {
            status: ResponseStatus.FAIL,
            message: 'Unauthorized, Token is required!',
        };
        res.status(401).json(response);
    }
});

export default middlewareRouter;