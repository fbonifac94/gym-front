import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserStatusService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) {

  }

  unsuscribeUser(userId: number): Observable<void> {
    const url = environment.endpoints.unsuscribeUser + userId;
    return this.httpClient.put<void>(url, {}, {headers: this.commonService.getHeaders()});
  }

  suscribeUser(userId: number): Observable<void> {
    const url = environment.endpoints.suscribeUser + userId;
    return this.httpClient.put<void>(url, {}, {headers: this.commonService.getHeaders()});
  }
}
