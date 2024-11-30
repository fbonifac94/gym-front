import { Injectable } from '@angular/core';
import { Day } from '../../domain/day';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../common-service/common.service';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }


  getDays(): Observable<Day[]> {
    return this.httpClient.get<Day[]>(environment.endpoints.days, {
          headers: this.commonService.getHeaders(),
          observe: 'response'
        }
      ).pipe(map((response: HttpResponse<Day[]>) => response.body as Day[]));
  }
}
