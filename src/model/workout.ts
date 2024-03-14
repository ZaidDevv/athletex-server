import { Schema, model, Document, Model } from 'mongoose';
import { IExercise } from './exercise';
import { Equipment, ExerciseCategory, Position, SkillLevel } from '../enums/common';

export interface IWorkout extends Document {
    duration: number; // Duration of the workout in seconds
    categories: ExerciseCategory[]; // Categories of the exercises in the workout
    description: string; // Description of the workout
    exercises: IExercise[]; // Exercises in the workout
    skillLevel: SkillLevel; // Skill level required (e.g., beginner, intermediate, advanced)
    positionFocus: Position[]; // Positions that might benefit from the workout (e.g., guard, forward, center)
    equipmentNeeded: Equipment[]; // Equipment needed for the workout
}

const workoutSchema : Schema = new Schema({
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    categories: {
        type: [String],
        enum: Object.keys(ExerciseCategory).filter(key => isNaN(Number(key))),
        required: true,
    },
    exercises: {
        type: [Schema.Types.ObjectId],
        ref: 'Exercise',
        required: true,
    },
    skillLevel: { 
        type: String,
        enum:Object.keys(SkillLevel),
        required: true },
    positionFocus: {
        type: [String],
        enum: Object.keys(Position).filter(key => isNaN(Number(key))),
        required: true,
    },
    equipmentNeeded: {
        type: [String],
        enum: Object.keys(Equipment).filter(key => isNaN(Number(key))),
        required: true,
    }
});


const Workout = model<IWorkout>('Workout', workoutSchema);

export default Workout;