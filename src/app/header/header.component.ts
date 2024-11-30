import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/auth/localstorage/localstorage.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  menuItems: MenuItem[] = [];

  constructor(private router: Router, private localStorageService: LocalstorageService, private matDialog: MatDialog) {
    this.loadMenuItems();
  }
  ngOnInit(): void {

  }

  loadMenuItems() {
    this.menuItems = [
      { label: 'Administradores', route: '/administradores', isAvailable: this.isOwner },
      { label: 'Profesores', route: '/profesores', isAvailable: (this.isAdmin || this.isOwner) },
      { label: 'Clientes', route: '/clientes', isAvailable: (this.isAdmin || this.isTeacher || this.isOwner) },
      { label: 'Ejercicios', route: '/ejercicios', isAvailable: this.isTeacher },
      { label: 'Rutinas', route: '/rutinas/' + this.userId, isAvailable: (this.isCustomer) },
      { label: 'Clases', route: 'clases', isAvailable: true },
      { label: 'Administración de clases', route: 'clases/administracion', isAvailable: (this.isAdmin || this.isOwner) },
      { label: 'Suscripciones', route: 'suscripciones', isAvailable: (this.isAdmin || this.isOwner) },
      { label: 'Detalles del usuario', route: 'usuario/detalle/' + this.userId, isAvailable: true },
    ];
  }

  get availableMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isAvailable);
  }

  get isAuthenticated(): boolean {
    return this.localStorageService.isAuthenticated;
  }

  get isOwner(): boolean {
    return this.localStorageService.isOwner;
  }

  get isAdmin(): boolean {
    return this.localStorageService.isAdministrator;
  }

  get isTeacher(): boolean {
    return this.localStorageService.isTeacher;
  }

  get isCustomer(): boolean {
    return this.localStorageService.isCustomer;
  }

  get userId(): number {
    return this.localStorageService.authenticatedUserId;
  }

  get username(): string {
    return this.localStorageService.authenticatedName;
  }

  get expirationDateMembership(): Date {
    return this.localStorageService.authenticatedExpirationDateMembership;
  }

  logout() {
    this.localStorageService.cerrarSesion();
    this.menuItems = [];
    this.router.navigate(['']);
  }

  login() {
    let dialogRef = this.matDialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (this.localStorageService.authenticatedIsFirstLogin) {
        this.router.navigate(['cambio-contrasenia']);  
      } else {
        this.router.navigate(['']);
      }

      this.loadMenuItems();
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

export interface MenuItem {
  label: string;
  route: string;
  isAvailable: boolean;
}