import { Request, Response } from 'express';
import {JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION, JWT_SECRET } from '../settings';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';
import { IResponseSchema, ResponseStatus } from '../enums/common';
import wLogger from '../logger';
import { level } from 'winston';
import Workout from '../model/workout';

const logger = wLogger({logName: 'AuthController', level: 'info'});
export class AuthController {
    static async login(req: Request, res: Response) {

        logger.info('Login request received');
        let response: IResponseSchema;

        // Check if either username or email is provided
        if (!req.body.username && !req.body.email || !req.body.password) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body, please provide either an email or a username!",
            } as IResponseSchema;
            logger.info(response.message);
            return res.status(422).json(response);
        }

        try {
            const user: IUser | null = await User.findOne({
                $or: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            });

            if (!user) {
                response = {
                    status: ResponseStatus.ERROR,
                    message: "User not found!",
                } as IResponseSchema;
                logger.info(response.message);
                return res.status(404).json(response);
            }

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            if (!isPasswordValid) {
                response = {
                    status: ResponseStatus.ERROR,
                    message: "Invalid username/email or password",
                } as IResponseSchema;
                logger.info(response.message);
                return res.status(401).json(response);
            }

            const accessToken: string = jwt.sign({
                data: { "_id": user._id,'username': user.username, "isAdmin": user.isAdmin,'email': user.email, 'isRefreshToken': false}
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign({ "_id": user._id, data: { 'username': user.username, "isAdmin": user.isAdmin, 'email': user.email, 'isRefreshToken': true } }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    user: {
                        fullName: user.fullName,
                        email: user.email,
                        DOB: user.DOB,
                        username: user.username,
                        isAdmin: user.isAdmin,
                        tokens:{
                            accessToken,
                            refreshToken,
                        }
                    },
                }
            } as IResponseSchema;
            // if the request is not an api request, set cookie and redirect to dashboard     
            if(req.headers.referer && !req.headers.referer.includes('api')){
                // set cookie and override old if it exists : 
                res.cookie('token', accessToken, { httpOnly: true });
            }

            return res.status(200).json(response);
        
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;
            logger.error(response.message);
            return res.status(500).json(response);

        }
    }

    static async register(req: Request, res: Response) {
        let response: IResponseSchema;

        if (!req.body.fullName || !req.body.email || !req.body.DOB || !req.body.username || !req.body.password) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            } as IResponseSchema;
            logger.info(response.message);
            return res.status(422).json(response);
        }
        try {
            const user = await User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                DOB: req.body.DOB,
                username: req.body.username,
                password: req.body.password,
            });

            const accessToken: string = jwt.sign({
                data: {  "_id": user._id, 'username': req.body.username, "isAdmin": false,'email': req.body.email,'isRefreshToken': false }
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign({  "_id": user._id, data: { 'username': req.body.username,"isAdmin": false, 'email': req.body.email,'isRefreshToken': true } }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    user: {
                        fullName: user.fullName,
                        email: user.email,
                        DOB: user.DOB,
                        username: user.username,
                        tokens:{
                            accessToken,
                            refreshToken,
                        }
                    },

                }
            } as IResponseSchema;

            logger.info('User registered successfully')
            logger.info(response);
            return res.status(201).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;
            logger.error(response.message);
            return res.status(500).json(response);
        }
    };

    static async refreshToken(req: Request, res: Response) {
        let response: IResponseSchema;

        if (!req.body.refreshToken) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            } as IResponseSchema;
            logger.warn(response.message);
            return res.status(422).json(response);
        }

        try {
            const verified = jwt.verify(req.body.refreshToken, JWT_SECRET) as jwt.JwtPayload;
            if(verified.data.isRefreshToken === false){
                throw new jwt.JsonWebTokenError('Refresh token passed instead of access token');
            }
            const accessToken: string = jwt.sign({
                data: { "_id": verified.data._id,'username': verified.data.username, "isAdmin": verified.data.isAdmin,'email': verified.data.email,'isRefreshToken': false }
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign(
                { data: { "_id":verified.data._id,'username': verified.data.username, 'email': verified.data.email, "isAdmin": verified.data.isAdmin,'isRefreshToken': true } },
                JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    tokens:{
                        accessToken,
                        refreshToken
                    }
                }
            } as IResponseSchema;
            logger.info('Token refreshed successfully');
            logger.info(response);
            return res.status(200).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;

            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json(response);
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json(response);
            }
            logger.warn(response.message);

            return res.status(500).json(response);
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            res.clearCookie('token');
            const response: IResponseSchema = {
                status: ResponseStatus.SUCCESS,
                message: 'User logged out successfully',
            };
            logger.info(response.message);
            return res.status(200).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            const response: IResponseSchema = {
                status: ResponseStatus.ERROR,
                message: message,
            };
            logger.error(response.message);
            return res.status(500).json(response);
        }
    }

}