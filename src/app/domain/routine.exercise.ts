import { Exercise } from "./exercise";

export interface RoutineExercise {
    id: number;
    exercise: Exercise;
    repetitions: number;
    series: number;
    aditionalInfo: string;
  }