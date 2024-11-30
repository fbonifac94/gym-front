import { Pipe, PipeTransform } from '@angular/core';
import { SuscriptionTimeUnits } from '../domain/enum/suscription.time.units';

@Pipe({
  name: 'suscriptionTimeUnits',
  standalone: true
})
export class SuscriptionTimeUnitsPipe implements PipeTransform {

  transform(value: SuscriptionTimeUnits, ...args: unknown[]): string {
    if (value == SuscriptionTimeUnits.DAY) {
      return 'Día/s'
    }
    if (value = SuscriptionTimeUnits.MONTH) {
      return 'Mes/es'
    }
    if (value = SuscriptionTimeUnits.YEAR) {
      return 'Año/s'
    }
    return '';
  }

}
