import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import app from '../app';

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'general.log'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));