import { Request, Response } from 'express';
import { IResponseSchema, JWT_EXPIRATION, JWT_SECRET, ResponseStatus } from '../settings';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';

export class AuthController {
    static async login(req: Request, res: Response) {

        // Check if the request body is valid, check if email or user is valid and password is valid
        let response: IResponseSchema;

        if (!req.body.username || !req.body.password) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            } as IResponseSchema;
            return res.status(422).json(response);
        }

        const user: IUser | null = await User.findOne({ "username": req.body.username });

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
                message: "Invalid username or password",
            } as IResponseSchema;
            return res.status(401).json(response);
        }

        const accessToken: string = jwt.sign({
            data: { 'username': user.username, 'email': user.email, }
        }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        const refreshToken: string = jwt.sign({ data: { 'username': user.username, 'email': user.email, } }, JWT_SECRET, { expiresIn: JWT_EXPIRATION * 12 });

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
    }
    static register = async (req: Request, res: Response) => {
        let response: IResponseSchema;

        if (!req.body.fullName || !req.body.email || !req.body.DOB || !req.body.username || !req.body.password) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            } as IResponseSchema;
            return res.status(422).json(response);
        }

        const accessToken: string = jwt.sign({
            data: { 'username': req.body.username, 'email': req.body.email, }
        }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        const refreshToken: string = jwt.sign({ data: { 'username': req.body.username, 'email': req.body.email, } }, JWT_SECRET, { expiresIn: JWT_EXPIRATION * 12 });

        const password = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            DOB: req.body.DOB,
            username: req.body.username,
            password: password,
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
    };
}