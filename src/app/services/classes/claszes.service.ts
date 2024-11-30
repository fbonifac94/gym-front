import { Injectable } from '@angular/core';
import { Clasz } from '../../domain/clasz';
import { PaginatedObject } from '../../domain/paginated-object';
import { map, Observable } from 'rxjs';
import { CommonService } from '../common-service/common.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroments';
import { ClassCreationRequest } from '../../domain/request/class.creation.reques';
import { UpdateClaszRequest } from '../../domain/request/class.edit.request';

@Injectable({
  providedIn: 'root'
})
export class ClaszesService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getClaszes(pageNumber: number, pageSize: number, sortProperty: string, sortDirection: string): Observable<PaginatedObject<Clasz>> {
    const url = environment.endpoints.classes;

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortProperty)
      .set('sortDirection', sortDirection);

    return this.httpClient.get<PaginatedObject<Clasz>>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response',
        params,
      }
    ).pipe(map((response: HttpResponse<PaginatedObject<Clasz>>) => response.body as PaginatedObject<Clasz>));
  }

  createClass(request: ClassCreationRequest): Observable<void> {
    return this.httpClient.post<void>(environment.endpoints.classes, request,
      {
        headers: this.commonService.getHeaders()
      });
  }

  updateClass(claszId: number, request: UpdateClaszRequest): Observable<void> {
    const url = environment.endpoints.classes + "/" + claszId; 
    return this.httpClient.put<void>(url, request,
      {
        headers: this.commonService.getHeaders()
      });
  }

  enableClass(claszId: number): Observable<void> {
    const url = environment.endpoints.enableClasses + claszId; 
    return this.httpClient.put<void>(url, null,
      {
        headers: this.commonService.getHeaders()
      });
  }

  disableClass(claszId: number): Observable<void> {
    const url = environment.endpoints.disableClasses + claszId; 
    return this.httpClient.put<void>(url, null,
      {
        headers: this.commonService.getHeaders()
      });
  }
}
