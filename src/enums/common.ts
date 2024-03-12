
// 
export enum ExerciseCategory {
    SHOOTING,
    DRIBBLING,
    DEFENDING,
    PASSING,
    REBOUNDING,
    BLOCKING,
    STEALING ,
    FREE_THROW ,
    THREE_POINT_SHOOTING,
    TWO_POINT_SHOOTING 
}

// Enum for the area of the court where the exercise is performed
export enum CourtArea {
    PAINT,
    BASELINE ,
    PERIMETER ,
    HALF_COURT_LINE,
    FREE_THROW_LINE ,
    KEY_EXTENDED,
}


// Enum for equipment needed for the exercise
export enum Equipment {
    BASKETBALL = 'Basketball',
    CONES = 'Cones',
    HOOP = 'Hoop',
    JUMP_ROPE = 'Jump Rope',
    MEDICINE_BALL = 'Medicine Ball',
    RESISTANCE_BAND = 'Resistance Band',
    WEIGHTS = 'Weights',
    NONE = 'None'
}


// Enum for the position focus of the exercise
export enum Position{
    GUARD,
    FORWARD,
    CENTER,
    ALL,
}

export enum SkillLevel {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
}

// Enum for the response schema
export interface IResponseSchema {
    status: ResponseStatus;
    data?: any;
    message?: string;
}

// Enum for the response status
export enum ResponseStatus {
    SUCCESS = "success",
    ERROR = "error",
    FAIL = "fail"
}