import { Router } from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

const morganRouter = Router();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' });

morganRouter.use(morgan('common', { stream: accessLogStream }));

morganRouter.use(morgan('dev'));

export default morganRouter;