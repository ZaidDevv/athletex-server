import { Request, Response } from 'express';
import { IResponseSchema, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION, JWT_SECRET, ResponseStatus } from '../settings';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';

export class AuthController {
    static async login(req: Request, res: Response) {

        let response: IResponseSchema;

        // Check if either username or email is provided
        if (!req.body.username && !req.body.email || !req.body.password) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body, please provide either an email or a username!",
            } as IResponseSchema;
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
                return res.status(404).json(response);
            }

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            if (!isPasswordValid) {
                response = {
                    status: ResponseStatus.ERROR,
                    message: "Invalid username/email or password",
                } as IResponseSchema;
                return res.status(401).json(response);
            }

            const accessToken: string = jwt.sign({
                data: { 'username': user.username, 'email': user.email, }
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign({ data: { 'username': user.username, 'email': user.email, } }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    user: {
                        fullName: user.fullName,
                        email: user.email,
                        DOB: user.DOB,
                        username: user.username,
                    },
                    accessToken,
                    refreshToken,
                }
            } as IResponseSchema;

            return res.status(200).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;
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
            return res.status(422).json(response);
        }
        try {
            const accessToken: string = jwt.sign({
                data: { 'username': req.body.username, 'email': req.body.email, }
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign({ data: { 'username': req.body.username, 'email': req.body.email, } }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            const user = await User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                DOB: req.body.DOB,
                username: req.body.username,
                password: req.body.password,
            });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    user: {
                        fullName: user.fullName,
                        email: user.email,
                        DOB: user.DOB,
                        username: user.username,
                    },
                    accessToken,
                    refreshToken,
                }
            } as IResponseSchema;

            return res.status(201).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;
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
            return res.status(422).json(response);
        }

        try {
            const verified = jwt.verify(req.body.refreshToken, JWT_SECRET) as jwt.JwtPayload;;

            console.log(verified)
            if (!verified || !('username' in verified.data && 'email' in verified.data)) {
                response = {
                    status: ResponseStatus.FAIL,
                    message: 'Unauthorized, Token is invalid or has expired!',
                };
                return res.status(401).json(response);
            }

            const accessToken: string = jwt.sign({
                data: { 'username': verified.data.username, 'email': verified.data.email, }
            }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

            const refreshToken: string = jwt.sign(
                { data: { 'username': verified.data.username, 'email': verified.data.email, } },
                JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

            response = {
                status: ResponseStatus.SUCCESS,
                data: {
                    accessToken,
                    refreshToken
                }
            } as IResponseSchema;

            return res.status(200).json(response);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
            response = {
                status: ResponseStatus.ERROR,
                message: message,
            } as IResponseSchema;

            if (error instanceof jwt.TokenExpiredError) {
                response.message = 'Token has expired';
                return res.status(401).json(response);
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                response.message = 'Invalid token';
                return res.status(401).json(response);
            }
            return res.status(500).json(response);
        }
    }
}