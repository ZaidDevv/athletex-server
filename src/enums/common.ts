
// Enum for the basketball exercise category
export enum ExerciseCategory {
    NONE = "NONE",
    SHOOTING = "Shooting",
    DRIBBLING = "Dribbling",
    PASSING = "Passing",
    DEFENDING = "Defending",
    BLOCKING = "Blocking",
    STEALING = "Stealing",
    TWO_POINT_SHOOTING = "Two Point Shooting",
    THREE_POINT_SHOOTING = "Three Point Shooting",
    FREE_THROW = "Free Throw",
    REBOUNDING = "Rebounding",
    CONDITIONING = "Conditioning",
    FOOTWORK = "Footwork"
}
// Enum for the area of the court where the exercise is performed
export enum CourtArea {
    PAINT = "Paint",
    BASELINE = "Baseline",
    PERIMETER = "Perimeter",
    HALF_COURT_LINE = "Half Court Line",
    FREE_THROW_LINE = "Free Throw Line",
    KEY_EXTENDED = "Key Extended",
    ANY = "Any" // For exercises that can be performed anywhere on the court
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
    POINT_GUARD = "Point Guard",
    POWER_FORWARD  = "Power Forward",
    SHOOTING_GUARD = "Shooting Guard",
    CENTER = "Center",
    ALL = "All",
}

export enum SkillLevel {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
    EXPERT = 4
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

export function isValidKey({ key, enumType }: { key: string; enumType: any }): boolean {
    return Object.keys(enumType).includes(key);
}

export function getEnumValue({ key, enumType }: { key: string; enumType: any }): any {
    return enumType[key as keyof typeof enumType];
}