import { Equipment, ExerciseCategory, IResponseSchema, Position, ResponseStatus, SkillLevel, getEnumValue } from "../enums/common";
import { Response,Request } from "express";
import Exercise, { IExercise } from "../model/exercise";
import Workout, { IWorkout } from "../model/workout";
import User from "../model/user";

export class WorkoutController {
    static generateWorkout = async (req: Request, res: Response) => {
        const { timeAllocated, exerciseCategories, equipmentNeeded} = req.body;
        let response: IResponseSchema;

        if (!timeAllocated) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            };
            res.status(422).json(response);
            return;
        }
        try{
            var workout = await produceWorkout(timeAllocated, exerciseCategories, equipmentNeeded);
            workout.user = req.cookies.session._id;
            const newWorkout = await Workout.create(workout);

            if(req.query.expand && req.query.expand === '1'){
                await Workout.populate(newWorkout, { path: 'exercises' });
            }
            res.json({ status: ResponseStatus.SUCCESS, data: newWorkout } as IResponseSchema);
            return;
        } catch (e) {
            const error = e as Error;
            console.log(error);
            if(error.message === "No exercises found for the given categories"){
                res.status(404).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
            }
            else{
                res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
            
            }
        }
    };
    static getWorkouts = async (req: Request, res: Response) => {
        try {
            // find and sort by date created
            const sort = req.query.sort === 'asc' ? 1 : -1;
            const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            var workouts = await Workout.find().sort({ [sortBy as string]: sort });
            // limit if found in req.query
            if (limit) {
                workouts = workouts.slice(0, limit);
            }
            // expand if in query params 
            if(req.query.expand && req.query.expand === '1'){
                await Workout.populate(workouts, [{ path: 'exercises' }, { path: 'user' }]);
            }
            res.json({ status: ResponseStatus.SUCCESS, data: workouts });
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };

    static getWorkoutById = async (req: Request, res: Response) => {
        try {
            const workout = await Workout.findById(req.params.id);
            if (!workout) {
                res.status(404).json({ status: ResponseStatus.ERROR, message: "Workout not found" } as IResponseSchema);
                return;
            }
            res.json({ status: ResponseStatus.SUCCESS, data: workout });
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };

    static getLastestUserWorkout = async (req: Request, res: Response) => {
        try {
            console.log(req.cookies)
            const workout = await Workout.findOne({ user: req.cookies.session._id }).sort({ createdAt: -1 });
            if (!workout) { 
                res.status(404).json({ status: ResponseStatus.ERROR, message: "Workout not found" } as IResponseSchema);
                return;
            }
            if(req.query.expand && req.query.expand === '1'){
                await Workout.populate(workout, { path: 'exercises' });
            }
            res.json({ status: ResponseStatus.SUCCESS, data: workout });

        }
        catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };

    static deleteWorkout = async (req: Request, res: Response) => {
        try {
            const workout = await Workout.findByIdAndDelete(req.params.id);
            if (!workout) {
                res.status(404).json({ status: ResponseStatus.ERROR, message: "Workout not found" } as IResponseSchema);
                return;
            }
            res.json({ status: ResponseStatus.SUCCESS, message: "Workout deleted successfully" });
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };
}

async function produceWorkout(timeAllocated: number, exerciseCategories: ExerciseCategory[], equipmentNeeded: Equipment[]): Promise<IWorkout> {
    let query: any = {};

    if (exerciseCategories) {
        query.categories = { $in: exerciseCategories };
    }
    
    if (equipmentNeeded) {
        query.equipmentNeeded = { $in: equipmentNeeded };
    }
    
    const filteredExercises = await Exercise.find(query);
    if(filteredExercises.length === 0){
        throw new Error("No exercises found for the given categories");
    }
    let workout : IWorkout = {} as IWorkout;

    let workoutDuration: number = 0;
    let workoutExercises: IExercise[] = [];

    try {

    while (workoutDuration < timeAllocated) {
        const randomIndex = Math.floor(Math.random() * filteredExercises.length);
        const randomExercise = filteredExercises[randomIndex];
        workoutDuration += randomExercise.duration;
        workoutDuration += randomExercise.sets.reduce((acc: number, set: any) => acc + (set.restPeriod || 0), 0);
        if (workoutDuration <= timeAllocated) {
            workoutExercises.push(randomExercise);
        }
    }
    const skillLevel = Math.round(workoutExercises.reduce((acc: number, exercise: IExercise) => acc + getEnumValue({key:exercise.skillLevel,enumType:SkillLevel}), 0) / workoutExercises.length);
    workout.skillLevel = getEnumValue({key:skillLevel,enumType:SkillLevel});
    workout.duration = workoutExercises.reduce((acc: number, exercise: IExercise) => acc + exercise.duration, 0);
    workout.categories = exerciseCategories 
    // turn into set to remove duplicates
    workout.equipmentNeeded = Array.from(new Set(workoutExercises.reduce((acc: Equipment[], exercise: IExercise) => {
        if(exercise.equipmentNeeded.includes(Equipment.NONE)){
            return acc;
        }
        return acc.concat(exercise.equipmentNeeded);
    }, [])));
    
    workout.positionFocus = Array.from(new Set(workoutExercises.reduce((acc: Position[], exercise: IExercise) => {
        return acc.concat(exercise.positionFocus);
    }, []))).filter((pos) => pos !== null && pos !== undefined).slice(0, 3);
    
    workout.categories = Array.from(new Set(workoutExercises.reduce((acc: ExerciseCategory[], exercise: IExercise) => {
        return acc.concat(exercise.categories);
    }, [])));
    
    workout.exercises = workoutExercises;
    return workout;
}
    catch(e){
        console.log(e);
        throw new Error("Error generating workout");
    }
}


export default WorkoutController;