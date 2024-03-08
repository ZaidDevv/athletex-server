import express from "express";
import dotenv from 'dotenv';
import { JWT_SECRET } from "./settings";

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });

export default app;