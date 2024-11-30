import { inject } from '@angular/core';
import { LocalstorageService } from './auth/localstorage/localstorage.service';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroments';


export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const localStorageService = inject(LocalstorageService);
  const router = inject(Router);

  const noAuthenticationNeededUrl = [environment.endpoints.authentication, environment.endpoints.forgotPasswordCodeGeneration,
  environment.endpoints.forgotPasswordCodeValidation, environment.endpoints.forgotPasswordPasswordUpdate];
  const url: string = req.url;
  if ((!localStorageService.isAuthenticated && noAuthenticationNeededUrl.some((elem: string) => url.startsWith(elem))) || (localStorageService.isAuthenticated && !localStorageService.isTokenExpired)) {
    return next(req);
  } else {
    localStorageService.cerrarSesion();
    router.navigate(['']);
    return EMPTY;
  };
}