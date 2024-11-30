import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExerciseTypeRequest } from '../../domain/request/create.exercise.type.request';
import { environment } from '../../../enviroments/enviroments';
import { ExerciseType } from '../../domain/exercise.type';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseTypeService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getExerciseTypes(): Observable<ExerciseType[]> {
    return this.httpClient.get<ExerciseType[]>(environment.endpoints.exerciseType, { headers: this.commonService.getHeaders() });
  }

  createExerciseType(execiseTypeName: string): Observable<void> {
    const request: CreateExerciseTypeRequest = {
      execiseTypeName
    };

    return this.httpClient.post<void>(environment.endpoints.exerciseType, request, { headers: this.commonService.getHeaders() });
  }

  deleteExerciseType(exerciseTypeId: number): Observable<void> {
    const url = environment.endpoints.exerciseType + '/' + exerciseTypeId;
    return this.httpClient.delete<void>(url, { headers: this.commonService.getHeaders() });
  }
}
