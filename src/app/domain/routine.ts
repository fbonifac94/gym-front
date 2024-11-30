import { Customer } from "./customer";
import { RoutineExercise } from "./routine.exercise";
import { Teacher } from "./teacher";

export interface Routine {
  id: number;
  title: string;
  creationDate: Date;
  modificationDate: Date;
  customer: Customer;
  teacher: Teacher;
  aditionalInfo: string;
  exercises: RoutineExercise[];
}