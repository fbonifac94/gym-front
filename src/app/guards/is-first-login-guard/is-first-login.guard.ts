import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { inject } from '@angular/core';

export const isFirstLoginGuard: CanActivateFn = (route, state) => {
  const localstorageService = inject(LocalstorageService);
  const router = inject(Router);
  if (localstorageService.authenticatedIsFirstLogin) {
    router.navigate(['cambio-contrasenia']);
    return false;
  }
  return true;
};
