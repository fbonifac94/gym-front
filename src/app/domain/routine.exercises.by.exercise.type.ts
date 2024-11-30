import { ExerciseType } from "./exercise.type";
import { RoutineExercise } from "./routine.exercise";

export interface RoutineExercisesByExerciseType {
    exerciseType: ExerciseType
    routineExercises: RoutineExercise[];
  }  