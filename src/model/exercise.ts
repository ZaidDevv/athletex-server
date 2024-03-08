import mongoose, { Schema, Document } from 'mongoose';
import { ExerciseCategory } from './workout';

export interface IExercise extends Document {
    name: string;
    description: string;
    effortLevel: number;
    videoLink: string;
    category: ExerciseCategory;
    duration: number;
    reps: number;
}

const exerciseSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    effortLevel: { type: Number, required: true },
    duration: { type: Number, required: true },
    reps: { type: Number, required: false },
    videoLink: { type: String, required: true },
    category: {
        type: String,
        enum: Object.values(ExerciseCategory),
        required: true,
    },
});

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;