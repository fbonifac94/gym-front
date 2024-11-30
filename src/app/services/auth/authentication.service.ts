import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { AuthenticationRequest } from '../../domain/request/authentication.request';
import { AuthenticationResponse } from '../../domain/response/authentication.response';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse | null> {
    return this.httpClient
          .post<AuthenticationResponse>(environment.endpoints.authentication,
            request, { headers: this.commonService.getHeaders(), observe: 'response' })
            .pipe(map((response: HttpResponse<AuthenticationResponse>) => response.body));
  }
}
