import { CreateRoutineRequest, UpdateRoutineRequest } from '../../domain/request/routine.request';
import { Routine } from '../../domain/routine';
import { RoutineCreation } from '../../domain/routine.creation';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { PaginatedObject } from '../../domain/paginated-object';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  createRoutine(userId: number, routine: RoutineCreation): Observable<void> {
    let request: CreateRoutineRequest = {
      userId,
      title: routine.title,
      aditionalInfo: routine.aditionalInfo,
      exercises: routine.exercises.map(routineExercise => {
        return {
          exerciseId: routineExercise.exercise.id,
          repetitions: routineExercise.repetitions,
          series: routineExercise.series,
          aditionalInfo: routineExercise.aditionalInfo
        };
      }),
    };
    return this.httpClient.post<void>(environment.endpoints.routines, request,
      {
        headers: this.commonService.getHeaders()
      });
  }

  updateRoutine(routineId: number, routine: RoutineCreation): Observable<void> {
    const url = environment.endpoints.routines + '/' + routineId;

    let request: UpdateRoutineRequest = {
      aditionalInfo: routine.aditionalInfo,
      exercises: routine.exercises.map(routineExercise => {
        return {
          exerciseId: routineExercise.exercise.id,
          repetitions: routineExercise.repetitions,
          series: routineExercise.series,
          aditionalInfo: routineExercise.aditionalInfo
        };
      }),
    };

    return this.httpClient.put<void>(url, request, { headers: this.commonService.getHeaders() });
  }

  deleteRoutine(routineId: number): Observable<void> {
    const url = environment.endpoints.routines + '/' + routineId;
    return this.httpClient.delete<void>(url, { headers: this.commonService.getHeaders() });
  }

  getRoutineByRoutineId(routineId: number): Observable<Routine> {
    const url = environment.endpoints.routinesByRoutineId + routineId.toString();

    return this.httpClient.get<Routine>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response'
      }
    ).pipe(map((response: HttpResponse<Routine>) => response.body as Routine));
  }


  getRoutinesByUserId(userId: number, pageNumber: number, pageSize: number,
    sortColumn: string, sortDirection: string): Observable<PaginatedObject<Routine>> {
    const url = environment.endpoints.routinesByUserId + userId;

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    return this.httpClient.get<PaginatedObject<Routine>>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response',
        params,
      }
    ).pipe(map((response: HttpResponse<PaginatedObject<Routine>>) => response.body as PaginatedObject<Routine>));
  }
}
