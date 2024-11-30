import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suscriptionExpireDate',
  standalone: true
})
export class SuscriptionExpireDatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    return (value) ? value : 'No se registraron pagos a la fecha';
  }

}
