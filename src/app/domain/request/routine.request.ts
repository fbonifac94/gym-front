export interface CreateRoutineRequest {
    title: string;
    userId: number;
    exercises: ExerciseByRoutineRequest[];
    aditionalInfo: string;
}

export interface UpdateRoutineRequest {
    exercises: ExerciseByRoutineRequest[];
    aditionalInfo: string;
}

export interface ExerciseByRoutineRequest {
    exerciseId: number;
    repetitions: number;
    series: number;
    aditionalInfo: string;
}