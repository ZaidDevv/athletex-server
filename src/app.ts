import express, { NextFunction } from "express";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import router from "./route/router";
import middlewareRouter from "./middleware/middleware";
import morganRouter from "./middleware/morgan";
import connectToDatabase from "./driver/mongodb";
import { IResponseSchema, ResponseStatus } from "./settings";
import rateLimiterRouter from "./middleware/rate_limiter";

dotenv.config();

const app = express();

// Connect to database
connectToDatabase();

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });

// Middlewares. Must be before routes...
app.use(middlewareRouter);

// Rate limiter middleware 
app.use(rateLimiterRouter);

// Morgan HTTP request logger middleware
app.use(morganRouter);

// Routes
app.use(router);


// Error Handling 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    let response: IResponseSchema = {
        status: ResponseStatus.ERROR,
        message: err.message
    };
    res.status(500).send(response);
    return;
});

export default app;