import { Exercise } from "./exercise";
import { ExerciseType } from "./exercise.type";

export interface ExercisesByExerciseType {
    exerciseType: ExerciseType;
    exercises: Exercise[];
}