import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { inject } from '@angular/core';

export const creationRoutineGuard: CanActivateFn = (route, state) => {
  const localstorageService = inject(LocalstorageService);
  const router = inject(Router);
  if (!localstorageService.isTeacher) {
    router.navigate(['']);
    return false;
  }
  return true;
};
