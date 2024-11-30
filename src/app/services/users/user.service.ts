import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../domain/user';
import { environment } from '../../../enviroments/enviroments';
import { map, Observable } from 'rxjs';
import { UpdateUserRequest } from '../../domain/request/update.user.request';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }


  getUserByUserId(userId: number): Observable<User> {
    const url = environment.endpoints.user + '/' + userId.toString();

    return this.httpClient.get<User>(url,
      {
        headers: this.commonService.getHeaders(),
        observe: 'response'
      }
    ).pipe(map((response: HttpResponse<User>) => response.body as User));
  }

  updateUser(userUpdateRequest: UpdateUserRequest): Observable<void> {
    const url = environment.endpoints.user;

    return this.httpClient.put<void>(url, userUpdateRequest, { headers: this.commonService.getHeaders() });
  }
}
