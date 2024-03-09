import mongoose, { ConnectOptions } from 'mongoose';
import { DATABASE_NAME, DATABASE_URL } from '../settings';

// Connect to MongoDB
function connectToDatabase() {
    mongoose.connect(DATABASE_URL, {
        dbName: DATABASE_NAME,
    } as ConnectOptions)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB', error);
        });
}

export default connectToDatabase;


