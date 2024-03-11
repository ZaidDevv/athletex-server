import { Equipment, ExerciseCategory, IResponseSchema, ResponseStatus } from "../enums/common";
import { Response,Request } from "express";
import Exercise, { IExercise } from "../model/exercise";
import Workout, { IWorkout } from "../model/workout";

export class WorkoutController {
    static generateWorkout = async (req: Request, res: Response) => {
        const { timeAllocated, exerciseCategories} = req.body;
        let response: IResponseSchema;

        if (!timeAllocated || !exerciseCategories) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            };
            res.status(422).json(response);
            return;
        }
        try{
            const workout = await produceWorkout(timeAllocated, exerciseCategories);
            const newWorkout = await Workout.create(workout);
            
            res.json({ status: ResponseStatus.SUCCESS, data: newWorkout } as IResponseSchema);
            return;
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };
    static getWorkouts = async (req: Request, res: Response) => {
        try {
            const workouts = await Workout.find();
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

async function produceWorkout(timeAllocated: number, exerciseCategories: ExerciseCategory[]): Promise<IWorkout> {
    const filteredExercises: IExercise[] = await Exercise.find({ category: { $in: exerciseCategories } });
    if(filteredExercises.length === 0){
        throw new Error("No exercises found for the given categories");
    }
    let workout : IWorkout = {} as IWorkout;

    let workoutDuration = 0;
    let workoutExercises: IExercise[] = [];
    // set for equipments needed
    const equipments = new Set<Equipment>();

    while (workoutDuration < timeAllocated) {
        const randomIndex = Math.floor(Math.random() * filteredExercises.length);
        const randomExercise = filteredExercises[randomIndex];
        workoutDuration += randomExercise.duration;
        if (workoutDuration <= timeAllocated) {
            randomExercise.equipmentNeeded.forEach(equipment => equipments.add(equipment));
            workoutExercises.push(randomExercise);
            randomExercise.positionFocus.forEach(position => {
                if (!workout.positionFocus.includes(position)) {
                    workout.positionFocus.push(position);
                }
            });
        }
    }
    workout.exercises = workoutExercises;
    workout.duration = workoutDuration;
    workout.categories = exerciseCategories;
    workout.skillLevel = workoutExercises.reduce((acc, exercise) => acc + exercise.skillLevel.valueOf(), 0) / workoutExercises.length;
    workout.equipmentNeeded = Array.from(equipments);
    return workout;
}