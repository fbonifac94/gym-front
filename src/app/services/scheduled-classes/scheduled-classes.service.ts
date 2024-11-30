import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedObject } from '../../domain/paginated-object';
import { ScheduledClass } from '../../domain/class.scheduled';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduledClassesService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getScheduledClasses(pageNumber: number, pageSize: number, sortProperty: string, sortDirection: string): Observable<PaginatedObject<ScheduledClass>> {
    const url = environment.endpoints.scheduledClasses;

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortProperty)
      .set('sortDirection', sortDirection);

    return this.httpClient.get<PaginatedObject<ScheduledClass>>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response',
        params,
      }
    ).pipe(map((response: HttpResponse<PaginatedObject<ScheduledClass>>) => response.body as PaginatedObject<ScheduledClass>));
  }

  cancelScheduledClasses(scheduledClaszId: number): Observable<void> {
    const url = environment.endpoints.cancelScheduledClass + scheduledClaszId;

    return this.httpClient.post<void>(url, null, { headers: this.commonService.getHeaders() });
  }
}
