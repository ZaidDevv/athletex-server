import { Router } from 'express';
import { rateLimit } from 'express-rate-limit'
import { Request, Response } from 'express';
import { IResponseSchema, ResponseStatus } from '../enums/common';

const rateLimiterRouter = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: (req: Request, res: Response) => {
        const response = {
            status: ResponseStatus.ERROR,
            message: 'Too many requests, please try again later.',

        } as IResponseSchema;
        res.status(429).json(response);
    },
})

rateLimiterRouter.use(limiter);

export default rateLimiterRouter;

