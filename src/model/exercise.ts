import mongoose, { Schema, Document } from 'mongoose';
import { CourtArea, Equipment, ExerciseCategory, Position, SkillLevel } from '../enums/common';

const exerciseSetSchema = new Schema({
    reps: { type: String, required: true },
    effortLevel: { type: Number, required: true },
});
export interface ExerciseSet{
    reps: number,
    effortLevel: number,
    restPeriod?: number
}

export interface IExercise extends Document {
    name: string; // Name of the exercise
    description: string; // Description of the exercise
    effortLevel: number; // Effort level of the exercise (e.g., 1-10)
    videoLink: string; // URL to a video of the exercise
    categories: ExerciseCategory[]; // Category of the exercise (e.g., shooting, dribbling, defending)
    duration: number; // Duration of the exercise in minutes
    totalSets: number; // Number of repetitions for the exercise
    totalReps: number; // Number of sets for the exercise
    skillLevel: SkillLevel; // Skill level required (e.g., beginner, intermediate, advanced, expert)
    positionFocus: Position; // Positions that might benefit from the drill (e.g., guard, forward, center)
    equipmentNeeded: Equipment[]; // Equipment needed for the drill (e.g., basketball, cones)
    courtArea: CourtArea; // Area of the court where the drill is performed (e.g., paint, three-point line, baseline)
    sets: ExerciseSet[]; // Sets of the exercise
}

const exerciseSchema: Schema = new Schema({
    totalSets: { type: Number, required: false },
    restPeriod: { type: Number, required: false },
    videoLink: { type: String, required: true },
    totalReps: { type: Number, required: false },
    name: { type: String, required: true }, 
    description: { type: String, required: false },
    effortLevel: { type: Number, required: true },
    duration: { type: Number, required: false },
    skillLevel: { 
        type: String,
        enum:Object.keys(SkillLevel),
        required: true },
    categories: {
        type: [String],
        enum: Object.values(ExerciseCategory),
        required: true,
    },
    positionFocus: {
        type: String,
        enum: Object.values(Position),
        required: false,
    },
    equipmentNeeded: {
        type: [String],
        enum: Object.values(Equipment),
        required: true,
    },
    courtArea: {
        type: String,
        enum: Object.values(CourtArea),
        required: false,
    },
    sets: { 
        type: [exerciseSetSchema],
        required: true,
        validate: [(val: any[]) => val.length <= 8, '{PATH} exceeds the limit of 8'],
        default: undefined
    },
}, { timestamps: true });


const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;