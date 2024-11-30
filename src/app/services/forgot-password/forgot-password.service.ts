import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { map, Observable } from 'rxjs';
import { UpdateForgottenPasswordRequest } from '../../domain/request/update.forgotten.password.request';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  generatePasswordRecuperationCode(email: String): Observable<void> {
    const url = environment.endpoints.forgotPasswordCodeGeneration + email;
    return this.httpClient.post<void>(url, {}, { headers: this.commonService.getHeaders() });
  }

  validatePasswordRecuperationCode(email: String, code: string): Observable<boolean> {
    const url = environment.endpoints.forgotPasswordCodeValidation + email;
    let params = new HttpParams().set('code', code);

    return this.httpClient.get<boolean>(url, {
      headers: this.commonService.getHeaders(),
      observe: 'response',
      params,
    }).pipe(map((response: HttpResponse<boolean>) => response.body as boolean));
  }

  updatePassword(email: String, code: string, password: string): Observable<void> {
    const url = environment.endpoints.forgotPasswordPasswordUpdate + email;
    const request: UpdateForgottenPasswordRequest = {
      code,
      password
    };
    return this.httpClient.put<void>(url, request, { headers: this.commonService.getHeaders() });
  }
}
