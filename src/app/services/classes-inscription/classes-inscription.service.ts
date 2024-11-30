import { Injectable } from '@angular/core';
import { CommonService } from '../common-service/common.service';
import { environment } from '../../../enviroments/enviroments';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ScheduledClaszInscription } from '../../domain/scheduled.clasz.inscription';

@Injectable({
  providedIn: 'root'
})
export class ClassesInscriptionService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  enrollToClass(scheduledClassId: number): Observable<void> {
    const url = environment.endpoints.enrollToClass + scheduledClassId;
    return this.httpClient.post<void>(url, null,
      {
        headers: this.commonService.getHeaders()
      });
  }

  eraseInscriptionClass(scheduledClassId: number): Observable<void> {
    const url = environment.endpoints.eraseInscriptionClass + scheduledClassId;
    return this.httpClient.post<void>(url, null,
      {
        headers: this.commonService.getHeaders()
      });
  }

  getInscriptionsByScheduledClassId(scheduledClassId: number): Observable<ScheduledClaszInscription[]> {
    const url = environment.endpoints.getInscriptionsToScheduledClass + scheduledClassId;
    console.log(url);
    return this.httpClient.get<ScheduledClaszInscription[]>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response'
      }
    ).pipe(map((response: HttpResponse<ScheduledClaszInscription[]>) => response.body as ScheduledClaszInscription[]))
  }

  getInscriptionsFromCustomerByUserId(userId: number): Observable<ScheduledClaszInscription[]> {
    const url = environment.endpoints.getInscriptionsToScheduledClassFromCustomerByUserId + userId;
    console.log(url);
    return this.httpClient.get<ScheduledClaszInscription[]>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response'
      }
    ).pipe(map((response: HttpResponse<ScheduledClaszInscription[]>) => response.body as ScheduledClaszInscription[]))
  }
}
