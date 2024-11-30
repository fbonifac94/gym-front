import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../domain/enum/status';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  transform(value: Status, ...args: unknown[]): string {
    return (value == Status.HA) ? 'Habilitada' : 'Deshabilitada' ;
  }

}
