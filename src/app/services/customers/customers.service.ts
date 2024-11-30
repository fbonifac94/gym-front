import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../../domain/customer';
import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { PaginatedObject } from '../../domain/paginated-object';
import { CommonService } from '../common-service/common.service';
import { UserStatus } from '../../domain/enum/user-status';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getCustomers(documentfilter: string | null, status: UserStatus | null, pageNumber: number, pageSize: number, sortColumn: string, sortDirection: string): Observable<PaginatedObject<Customer>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    if (documentfilter) {
      params = params.set('documentfilter', documentfilter);
    }

    if (status) {
      params = params.set('status', (status == UserStatus.HA) ? 'HA' : 'BA');
    }

    return this.httpClient
      .get<PaginatedObject<Customer>>(
        environment.endpoints.paginatedCustomers,
        {
          headers: this.commonService.getHeaders(),
          observe: 'response',
          params,
        }
      )
      .pipe(
        map(
          (response: HttpResponse<PaginatedObject<Customer>>) =>
            response.body as PaginatedObject<Customer>
        )
      );
  }
}
