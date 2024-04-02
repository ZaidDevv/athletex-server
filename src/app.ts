import express, { NextFunction } from "express";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import router from "./route/router";
import middlewareRouter from "./middleware/middleware";
import morganRouter from "./middleware/morgan";
import connectToDatabase from "./driver/mongodb";
import rateLimiterRouter from "./middleware/rate_limiter";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger';
import { HOST, PORT } from "./settings";
import { IResponseSchema, ResponseStatus } from "./enums/common";
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Connect to database
connectToDatabase();
app.listen(PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });

// Serve static files from the "public" directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Middlewares. Must be before routes...
app.use(middlewareRouter);

// Rate limiter middleware 
app.use(rateLimiterRouter);

// Morgan HTTP request logger middleware
app.use(morganRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cookie Parser
app.use(cookieParser());

// Use CORS
// app.use(cors({
//     origin: HOST, // replace with your client's domain
//     credentials: true
// }));

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