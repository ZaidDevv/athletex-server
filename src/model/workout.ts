import { Schema, model, Document } from 'mongoose';

export interface IWorkout extends Document {
    duration: number;
    categories: [string];
    description: string;
}

enum ExerciseCategory {
    SHOOTING = 'Shooting',
    DRIBBLING = 'Dribbling',
    DEFENDING = 'Defending',
    PASSING = 'Passing',
    REBOUNDING = 'Rebounding',
    BLOCKING = 'Blocking',
    STEALING = 'Stealing',
    FREE_THROW = 'Free Throw',
    THREE_POINT_SHOOTING = 'Three Point Shooting',
    TWO_POINT_SHOOTING = 'Two Point Shooting'
}

const workoutSchema = new Schema<IWorkout>({
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        enum: Object.values(ExerciseCategory),
        required: true,
    }
});

const Workout = model<IWorkout>('Workout', workoutSchema);

export default Workout;