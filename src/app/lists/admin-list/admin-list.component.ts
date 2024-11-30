import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AdminDataSource } from './admin.datasource';
import { AdminService } from '../../services/admin/admin.service';
import { Router } from '@angular/router';
import { UserType } from '../../domain/enum/user-types';
import { UserStatusPipe } from '../../user-status-pipe/user-status.pipe';
import { UpdateUserStatusService } from '../../services/update-status-user/update-status-user.service';
import { Admin } from '../../domain/admin';
import { UserStatus } from '../../domain/enum/user-status';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, MatSort, TitleCasePipe,
    UserStatusPipe, NgIf, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {

  documentFilterFormControl!: FormControl;

  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'documentNumber', 'status', 'actions'];
  dataSource: AdminDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private customerService: AdminService, private updateUserStatusService: UpdateUserStatusService, private router: Router,
    private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    this.dataSource = new AdminDataSource(this.customerService, snackBar);

    this.documentFilterFormControl = new FormControl(null);
    this.documentFilterFormControl.valueChanges.subscribe(() => this.loadAdmins());
  }

  ngAfterViewInit(): void {
    this.loadAdmins();
    this.paginator.page.subscribe(() => this.loadAdmins());
    this.sort.sortChange.subscribe(() => this.loadAdmins());
    this.cdr.detectChanges();
  }

  loadAdmins() {
    this.dataSource.loadAdmins(this.documentFilterFormControl.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  addAdmin() {
    this.router.navigate(['registro/' + UserType.ADMIN]);
  }

  detail(admin: Admin) {
    this.router.navigate(['usuario/detalle/' + admin.user.id]);
  }

  unsuscribeAdmin(admin: Admin) {
    this.updateUserStatusService.unsuscribeUser(admin.user.id).subscribe({
      next: () => {
        this.loadAdmins();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de baja al administrador.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  suscribeAdmin(admin: Admin) {
    this.updateUserStatusService.suscribeUser(admin.user.id).subscribe({
      next: () => {
        this.loadAdmins();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de alta al administrador.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  isSuscribed(admin: Admin) {
    return admin.user.status.toString() == 'HA';
  }
}
