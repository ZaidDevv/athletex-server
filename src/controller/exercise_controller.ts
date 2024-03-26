import express from 'express';
import multer from 'multer';
import { authenticated } from '../middleware/middleware';
import Exercise, { ExerciseSet, IExercise } from '../model/exercise';
import { CourtArea, Equipment, ExerciseCategory, IResponseSchema, Position, ResponseStatus, SkillLevel, getEnumValue } from '../enums/common';
import upload from '../middleware/multer';
import { HOST, PORT } from '../settings';
import path from 'path';
export class ExerciseController {
    static insertExercise = [
        upload.single('videoFile'),
        async (req: express.Request, res: express.Response) => {
        const videoFile = req.file && typeof req.file === 'object' ? req.file : undefined;
        if (!videoFile) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Video file is required' } as IResponseSchema);   
        }
        if (!req.body.exerciseName) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Exercise name is required' } as IResponseSchema);
        }
        if (!req.body.duration) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Duration is required' } as IResponseSchema);
        }
        if (!req.body.sets) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Sets are required' } as IResponseSchema);
        }
        if (!req.body.skillLevel) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Skill level is required' } as IResponseSchema);
        }
        if (!req.body.position) {
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Focus Position is required' } as IResponseSchema);
        }
        if(!req.body.categories){
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Categories are required' } as IResponseSchema);
        }
        if(!req.body.equipment){
            return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Equipment is required' } as IResponseSchema);
        }
        // Don't remove 'src' from the path
        req.file = { ...videoFile, path: videoFile.path };

        // Get the absolute path to the 'public' directory
        const publicDir = path.resolve(__dirname, '..', 'public');

        // Get the relative path from 'public' to the file
        const filePath = path.relative(publicDir, req.file.path);

        // Replace path separators with forward slashes
        const urlPath = filePath.split(path.sep).join('/');

        // Construct the URL
        const videoLink = `http://${HOST}:${PORT}/${urlPath}`;

        var sets : ExerciseSet[]= (req.body.sets as ExerciseSet[]).map(set => ({
            reps: Number(set.reps),
            effortLevel: Number(set.effortLevel),
            restPeriod: Number(set.restPeriod ?? 0),
        }));
        const totalReps = sets && req.body.sets.length > 0 ? sets.reduce((acc: number, set: any) => acc + set.reps, 0) : 0;

        const totalSets = sets && req.body.sets.length > 0 ? sets.length : 0;

        const effortLevel = sets && req.body.sets.length > 0 ? (sets.reduce((acc: number, set: any) => acc + set.effortLevel, 0) / sets.length).toFixed(2) : 0;

        let equipmentNeeded = (req.body.equipment as Equipment[]).map(equipment => getEnumValue({ enumType: Equipment, key: equipment }));

        req.body.categories = req.body.categories.map((category: string) => category.trim());

        let exerciseCategories = (req.body.categories as ExerciseCategory[]).map(category => {
            let enumValue = getEnumValue({ enumType: ExerciseCategory, key: category });
            if (enumValue === undefined) {
                console.log(`Key '${category}' not found in ExerciseCategory enum`);
            }
            return enumValue;
        });

        const exercise = {
            name: req.body.exerciseName,
            description: req.body.description,
            duration: req.body.duration,
            equipmentNeeded: equipmentNeeded,
            videoLink: videoLink,
            effortLevel: effortLevel,
            totalReps: totalReps,
            totalSets: totalSets,
            courtArea: getEnumValue({ enumType: CourtArea, key: req.body.courtArea }),
            skillLevel:req.body.skillLevel,
            positionFocus: getEnumValue({ enumType: Position, key: req.body.position }),
            sets: sets,
            categories: exerciseCategories,
        } as IExercise;

            try {
                const newExercise = await Exercise.create(exercise);
                return res.status(201).json({ status: ResponseStatus.SUCCESS, data: newExercise } as IResponseSchema);
            } catch (e) {
                const error = e as Error;
                return res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
            }
        }
    ];

    static async getExercises(req: express.Request, res: express.Response) {
        try {
            // find and sort by date created
            const sort = req.query.sort === 'asc' ? 1 : -1;
            const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            var exercises = await Exercise.find().sort({ [sortBy as string]: sort });
            // limit if found in req.query
            if (limit) {
                exercises = exercises.slice(0, limit);
            }
            res.json({ status: ResponseStatus.SUCCESS, data: exercises });
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    }

    static async getExercise(req: express.Request, res: express.Response) {
        try {
            if(!req.params.id){
                
                return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Exercise ID is required' } as IResponseSchema);

            }
            const exercise = await Exercise.findById(req.params.id);
            if (!exercise) {
                return res.status(404).json({ status: ResponseStatus.ERROR, message: 'Exercise not found' } as IResponseSchema);
                
            }
            return res.status(200);
        } catch (e) {
            const error = e as Error;
            return res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    }

    static async updateExercise(req: express.Request, res: express.Response) {
        try {
            if(!req.params.id){
                return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Exercise ID is required' } as IResponseSchema);
            }
            const exercise = await Exercise.findById(req.params.id);
            if (!exercise) {
                return res.status(404).json({ status: ResponseStatus.ERROR, message: 'Exercise not found' } as IResponseSchema);
                
            }
            const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ status: ResponseStatus.SUCCESS, data: updatedExercise } as IResponseSchema);
        } catch (e) {
            const error = e as Error;
            return res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    }

    static async deleteExercise(req: express.Request, res: express.Response) {
        try {
            if(!req.params.id){
                return res.status(422).json({ status: ResponseStatus.ERROR, message: 'Exercise ID is required' } as IResponseSchema);
                
            }
            const exercise = await Exercise.findById(req.params.id);
            if (!exercise) {
                return res.status(404).json({ status: ResponseStatus.ERROR, message: 'Exercise not found' } as IResponseSchema);
                
            }
            await Exercise.findByIdAndDelete(req.params.id);
            return res.status(200).json({ status: ResponseStatus.SUCCESS, message: 'Exercise deleted' } as IResponseSchema);
        } catch (e) {
            const error = e as Error;
            return res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    }
}