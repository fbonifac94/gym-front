import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../domain/enum/user-status';

@Pipe({
  name: 'userstatus',
  standalone: true
})
export class UserStatusPipe implements PipeTransform {

  transform(value: string): string {
    return Object.entries(UserStatus).find(([key, val]) => key === value)?.[1] || '';
  }

}
