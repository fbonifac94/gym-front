import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { filter, map, Observable } from 'rxjs';
import { ExercisesByExerciseType } from '../../domain/exercise.by.exercise.type';
import { CreateExerciseRequest } from '../../domain/request/create.exercise.request';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getExercisesGroupedByExerciseType(): Observable<ExercisesByExerciseType[]> {
    return this.httpClient
      .get<ExercisesByExerciseType[]>(
        environment.endpoints.exercisesGroupedByExerciseType,
        { headers: this.commonService.getHeaders(), observe: 'response' }
      )
      .pipe(
        map(
          (response: HttpResponse<ExercisesByExerciseType[]>) =>
            response.body
        ),
        filter((body): body is ExercisesByExerciseType[] => !!body)
      );
  }

  createExercise(exerciseTypeId: number, exerciseName: string): Observable<void> {
    const request: CreateExerciseRequest = {
      exerciseTypeId,
      exerciseName
    };

    return this.httpClient.post<void>(environment.endpoints.exercises, request, { headers: this.commonService.getHeaders() });
  }

  deleteExercise(exerciseId: number): Observable<void> {
    const url = environment.endpoints.exercises + '/' + exerciseId;
    return this.httpClient.delete<void>(url, { headers: this.commonService.getHeaders() });
  }

}
