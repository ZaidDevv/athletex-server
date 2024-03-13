import mongoose, { Schema, Document } from 'mongoose';
import { CourtArea, Equipment, ExerciseCategory, Position, SkillLevel } from '../enums/common';

export interface IExercise extends Document {
    name: string; // Name of the exercise
    description: string; // Description of the exercise
    effortLevel: number; // Effort level of the exercise (e.g., 1-10)
    videoLink: string; // URL to a video of the exercise
    category: ExerciseCategory; // Category of the exercise (e.g., shooting, dribbling, defending)
    duration: number; // Duration of the exercise in minutes
    reps: number; // Number of repetitions for the exercise
    sets: number; // Number of sets for the exercise
    restPeriod: number; // Rest period between sets in minutes
    skillLevel: SkillLevel; // Skill level required (e.g., beginner, intermediate, advanced)
    positionFocus: Position[]; // Positions that might benefit from the drill (e.g., guard, forward, center)
    equipmentNeeded: Equipment[]; // Equipment needed for the drill (e.g., basketball, cones)
    courtArea: CourtArea; // Area of the court where the drill is performed (e.g., paint, three-point line, baseline)
}

const exerciseSchema: Schema = new Schema({
    reps: { type: Number, required: false },
    restPeriod: { type: Number, required: false },
    videoLink: { type: String, required: true },
    sets: { type: Number, required: false },
    name: { type: String, required: true }, 
    description: { type: String, required: false },
    effortLevel: { type: Number, required: true },
    duration: { type: Number, required: true },
    skillLevel: { 
        type: String,
        enum:Object.keys(SkillLevel),
        required: true },
    category: {
        type: String,
        enum: Object.keys(ExerciseCategory),
        required: true,
    },
    positionFocus: {
        type: [String],
        enum: Object.keys(Position).filter(key => isNaN(Number(key))),
        required: false,
    },
    equipmentNeeded: {
        type: [String],
        enum: Object.keys(Equipment),
        required: true,
    },
    courtArea: {
        type: String,
        enum: Object.keys(CourtArea).filter(key => isNaN(Number(key))),
        required: false,
    },
});

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;