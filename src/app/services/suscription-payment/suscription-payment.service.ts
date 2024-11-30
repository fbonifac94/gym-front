import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedObject } from '../../domain/paginated-object';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroments';
import { SuscriptionPayment } from '../../domain/suscription.payment';
import { PostSuscriptionPaymentRequest } from '../../domain/request/post.suscription.request';
import { CommonService } from '../common-service/common.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SuscriptionPaymentService {
  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  getSuscriptionPaymentByUserId(userId: number, pageNumber: number, pageSize: number): Observable<PaginatedObject<SuscriptionPayment>> {
    const url = environment.endpoints.getSuscriptionPaymentByUserId + userId;

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.httpClient.get<PaginatedObject<SuscriptionPayment>>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response',
        params,
      }
    ).pipe(map((response: HttpResponse<PaginatedObject<SuscriptionPayment>>) => response.body as PaginatedObject<SuscriptionPayment>));
  }

  getSuscriptionPayments(documentNumber: string | null, startDate: string | null, endDate: string | null,
    pageNumber: number, pageSize: number): Observable<PaginatedObject<SuscriptionPayment>> {
    const url = environment.endpoints.getSuscriptionPayments;

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (documentNumber) {
      params = params.set('documetNumber', documentNumber);
    }

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    console.log(params);

    return this.httpClient.get<PaginatedObject<SuscriptionPayment>>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response',
        params,
      }
    ).pipe(map((response: HttpResponse<PaginatedObject<SuscriptionPayment>>) => response.body as PaginatedObject<SuscriptionPayment>));
  }

  postSuscriptionPayment(userId: number, request: PostSuscriptionPaymentRequest): Observable<void> {
    const url = environment.endpoints.postSuscriptionPayment + userId;
    return this.httpClient.post<void>(url, request, { headers: this.commonService.getHeaders() });
  }

  deleteSuscriptionPayment(suscriptionPaymentId: number): Observable<void> {
    const url = environment.endpoints.deleteSuscriptionPayment + suscriptionPaymentId;
    return this.httpClient.delete<void>(url, { headers: this.commonService.getHeaders() });
  }
}
