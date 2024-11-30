import { Exercise } from "./exercise";

export interface RoutineExerciseCreation {
    exercise: Exercise;
    repetitions: number;
    series: number;
    aditionalInfo: string;
  }