import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localstorageService = inject(LocalstorageService);
  const router = inject(Router);
  if (!localstorageService.isAuthenticated || localstorageService.isTokenExpired) {
    localstorageService.cerrarSesion();
    router.navigate(['']);
    return false;
  }
  return true;
};
