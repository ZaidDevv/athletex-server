
import express, { Request, Response, NextFunction } from 'express';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET,  } from '../settings';
import { IResponseSchema, ResponseStatus } from '../enums/common';

const middlewareRouter = express.Router();

middlewareRouter.use(express.json());

middlewareRouter.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware to check if the request is authenticated and optionally if the user is an admin
export const authenticated = (requireAdmin: boolean = false) => (req: Request, res: Response, next: NextFunction) => {
    let response: IResponseSchema;
    let token: string | undefined;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token as string;
    }

    if (token) {
        try {
            // verify the token
            const verified = jwt.verify(token, JWT_SECRET) as JwtPayload | undefined;
            if (!verified && !requireAdmin) {
                response = {
                    status: ResponseStatus.FAIL,
                    message: 'Unauthorized, Token is invalid or has expired!',
                };
                res.status(401).json(response);
                return ;
            } 
            else if (!verified || (requireAdmin && !verified.data.isAdmin)) {
                response = {
                    status: ResponseStatus.FAIL,
                    message: 'Forbidden, Token is invalid or has expired, or user is not an admin!',
                };
                res.status(403).json(response);
                return ;
            }
            // store the user in the request object
            req.cookies.user = verified.data;        
            next();
        }
        catch (e) {
            response = {
                status: ResponseStatus.ERROR,
                message: 'Unauthorized, Token is invalid or has expired!',
            };
            return res.status(401).json(response);
        }
    }
    else {
        response = {
            status: ResponseStatus.FAIL,
            message: 'Unauthorized, Token is required!',
        };
        return res.status(401).json(response);
    }
};

export default middlewareRouter;