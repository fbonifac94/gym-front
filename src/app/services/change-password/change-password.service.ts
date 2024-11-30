import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { ChangePasswordRequest } from '../../domain/request/change.password.request';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  updatePassword(oldPassword: string, newPassword: string): Observable<void> {
    const request: ChangePasswordRequest = {
      oldPassword, newPassword
    }
    const url = environment.endpoints.updatePassword;
    return this.httpClient.put<void>(url, request, { headers: this.commonService.getHeaders() });
  }
}
