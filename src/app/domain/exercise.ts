import { ExerciseType } from "./exercise.type";

export interface Exercise {
    id: number;
    name: string;
    exerciseType: ExerciseType
}