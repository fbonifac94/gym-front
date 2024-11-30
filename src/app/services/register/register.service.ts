import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationRequest } from '../../domain/request/registration.request';
import { map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { UserType } from '../../domain/enum/user-types';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  register(userType: UserType, request: RegistrationRequest): Observable<void> {
    const url = (userType == UserType.ADMIN) ? environment.endpoints.adminRegistration :
      ((userType == UserType.TEACHER) ? environment.endpoints.teacherRegistration : environment.endpoints.customerRegistration);

    return this.httpClient.post<void>(url, request, { headers: this.commonService.getHeaders() });
  }
}
