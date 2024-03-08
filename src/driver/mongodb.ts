import mongoose, { ConnectOptions } from 'mongoose';
import { DATABASE_URL } from '../settings';

// Connect to MongoDB
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

export default mongoose;

