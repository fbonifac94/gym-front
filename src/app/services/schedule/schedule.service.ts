import { Injectable } from '@angular/core';
import { Schedule } from '../../domain/schedule';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CommonService } from '../common-service/common.service';
import { Day } from '../../domain/day';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }


  getSchedules(): Observable<Schedule[]> {
    return this.httpClient.get<Schedule[]>(environment.endpoints.schedules, {
      headers: this.commonService.getHeaders(),
      observe: 'response'
    }
    ).pipe(map((response: HttpResponse<Schedule[]>) => response.body as Schedule[]))
      .pipe(map((schedules: Schedule[]) => {
        return schedules.map(schedule => {
          const date = new Date();
          const time = schedule.time.toString().split(',');
          date.setHours(Number(time[0]))
          date.setMinutes(Number(time[1]));
          schedule.time = date;
          return schedule;
        });
      }));
  }
}
