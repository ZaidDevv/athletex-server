import mongoose, { ConnectOptions } from 'mongoose';
import { DATABASE_NAME, DATABASE_URL } from '../settings';

// Connect to MongoDB
function connectToDatabase() {
    mongoose.connect(DATABASE_URL, {
        dbName: DATABASE_NAME,
        maxPoolSize: 10,
    } as ConnectOptions)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1);
        });
}

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit();
});

export default connectToDatabase;


