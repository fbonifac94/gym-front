import { Injectable } from '@angular/core';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  public saveTokenOnLocalStorage(token: string | undefined): void {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private getDecodedToken() {
    return this.token ? jwt_decode.jwtDecode<CustomJwtPayload>(this.token) : null;
  }

  get authenticatedUsername(): string {
    return this.getDecodedToken()?.username || '';
  }

  get authenticatedName(): string {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.firstName + ' ' + decodedToken?.lastName || '';
  }

  get authenticatedRole(): string {
    return this.getDecodedToken()?.role || '';
  }

  get authenticatedUserId(): number {
    return this.getDecodedToken()?.userId || 0;
  }

  get authenticatedExpirationDateMembership(): Date {
    return this.getDecodedToken()?.expirationDateMembership || new Date();
  }

  get authenticatedIsFirstLogin(): boolean {
    return (this.getDecodedToken()?.isFirstLogin == 'true') ? true : false;
  }

  get isAdministrator(): boolean {
    return this.authenticatedRole == 'ADMIN' || this.authenticatedRole == 'OWNER';
  }

  get isOwner(): boolean {
    return this.authenticatedRole == 'OWNER';
  }

  get isCustomer(): boolean {
    return this.authenticatedRole == 'CUSTOMER';
  }

  get isTeacher(): boolean {
    return this.authenticatedRole == 'TEACHER';
  }

  get isAuthenticated(): boolean {
    return this.token.length > 0 && this.authenticatedUsername.length > 0;
  }

  get isTokenExpired(): boolean {
    try {
      const decodedToken = jwt_decode.jwtDecode(this.token);
      if (!decodedToken) {
        return true;
      } else {
        const exp = (decodedToken.exp) ? decodedToken.exp : 0;
        const expirationDate = exp * 1000;
        const currentDate = new Date().getTime();
        return currentDate > expirationDate;
      }
    } catch (error) {
      console.error('Error al decodificar el JWT:', error);
      return true;
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
  }
}

interface CustomJwtPayload {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  userId: number;
  isFirstLogin: string;
  expirationDateMembership: Date;
}