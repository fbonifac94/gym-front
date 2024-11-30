import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalstorageService } from '../auth/localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private localStorageService: LocalstorageService) { }

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.localStorageService.token
    });
  }


}
