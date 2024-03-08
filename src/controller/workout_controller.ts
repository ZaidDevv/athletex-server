import mongoose from "../driver/mongodb";
import Workout, { IWorkout } from "../model/workout";
import { IResponseSchema, ResponseStatus } from "../settings";

export class WorkoutController {
    static generateWorkout = async (req: any, res: any) => {
        const { timeAllocated, exerciseCategory } = req.body;
        let response: IResponseSchema;

        if (!timeAllocated || !exerciseCategory) {
            response = {
                status: ResponseStatus.ERROR,
                message: "Invalid request body",
            };
            res.status(422).json(response);
            return;
        }
        res.json({ status: ResponseStatus.SUCCESS, data: [] });
    };
    static getWorkouts = async (req: any, res: any) => {
        try {
            const workouts = await Workout.find();
            res.json({ status: ResponseStatus.SUCCESS, data: workouts });
        } catch (e) {
            const error = e as Error;
            res.status(500).json({ status: ResponseStatus.ERROR, message: error.message } as IResponseSchema);
        }
    };

    static getWorkoutById = async (req: any, res: any) => {
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

    static deleteWorkout = async (req: any, res: any) => {
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