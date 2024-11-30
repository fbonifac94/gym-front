import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedObject } from '../../domain/paginated-object';
import { Admin } from '../../domain/admin';
import { environment } from '../../../enviroments/enviroments';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getAdmins(documentFilter: string | null, pageNumber: number, pageSize: number, sortColumn: string, sortDirection: string): Observable<PaginatedObject<Admin>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    if (documentFilter) {
      params = params.set('documentfilter', documentFilter);
    }

    return this.httpClient
      .get<PaginatedObject<Admin>>(
        environment.endpoints.paginatedAdmins,
        {
          headers: this.commonService.getHeaders(),
          observe: 'response',
          params,
        }
      )
      .pipe(
        map(
          (response: HttpResponse<PaginatedObject<Admin>>) =>
            response.body as PaginatedObject<Admin>
        )
      );
  }
}
