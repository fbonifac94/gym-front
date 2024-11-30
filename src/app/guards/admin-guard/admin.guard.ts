import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const localstorageService = inject(LocalstorageService);
  const router = inject(Router);
  if (localstorageService.isAdministrator || localstorageService.isOwner) {
    return true;
  }
  router.navigate(['']);
  return false;
};
