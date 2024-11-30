import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../../domain/teacher';
import { PaginatedObject } from '../../domain/paginated-object';
import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { CommonService } from '../common-service/common.service';
import { UserStatus } from '../../domain/enum/user-status';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getTeachers(documentFilter: string | null, pageNumber: number, pageSize: number, sortColumn: string, sortDirection: string): Observable<PaginatedObject<Teacher>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    if (documentFilter) {
      params = params.set('documentfilter', documentFilter);
    }

    return this.httpClient
      .get<PaginatedObject<Teacher>>(
        environment.endpoints.paginatedTeachers,
        {
          headers: this.commonService.getHeaders(),
          observe: 'response',
          params,
        }
      )
      .pipe(
        map(
          (response: HttpResponse<PaginatedObject<Teacher>>) =>
            response.body as PaginatedObject<Teacher>
        )
      );
  }

  getTeachersByStatus(status: UserStatus): Observable<Teacher[]> {
    const status_ = (status == UserStatus.HA)? 'HA' : 'BA';
    const url = environment.endpoints.paginatedByStatus + status_;
    return this.httpClient.get<Teacher[]>(url, {
      headers: this.commonService.getHeaders(),
      observe: 'response'
    }
    ).pipe(map((response: HttpResponse<Teacher[]>) => response.body as Teacher[]));
  }
}
