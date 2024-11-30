import { RoutineExerciseCreation } from "./routine.exercise.creation";

export interface RoutineCreation {
    title: string;
    exercises: RoutineExerciseCreation[];
    aditionalInfo: string;
  }