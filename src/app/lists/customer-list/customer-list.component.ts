import { CustomersService } from '../../services/customers/customers.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CustomerDataSource } from './customers.datasource';
import { Customer } from '../../domain/customer';
import { Router } from '@angular/router';
import { UserType } from '../../domain/enum/user-types';
import { UpdateUserStatusService } from '../../services/update-status-user/update-status-user.service';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SuscriptionPaymentComponent } from '../../suscription-payment/suscription-payment.component';
import { UserStatus } from '../../domain/enum/user-status';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuscriptionExpireDatePipe } from '../../pipes/suscription-expire-date.pipe';
import { UserStatusPipe } from '../../user-status-pipe/user-status.pipe';


@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, TitleCasePipe,
    MatSort, NgIf, MatLabel, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, DatePipe, MatProgressSpinnerModule, AsyncPipe, SuscriptionExpireDatePipe, UserStatusPipe],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent implements AfterViewInit {

  documentFilterFormControl!: FormControl;

  displayedColumns: string[];
  dataSource: CustomerDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private customerService: CustomersService, private updateUserStatusService: UpdateUserStatusService, private cdr: ChangeDetectorRef,
    private localStorageService: LocalstorageService, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) {
    if (this.isAdministrator) {
      this.displayedColumns = ['email', 'firstName', 'lastName', 'documentNumber', 'expireDate', 'status', 'actions'];
    } else {
      this.displayedColumns = ['email', 'firstName', 'lastName', 'documentNumber', 'actions'];
    }


    this.dataSource = new CustomerDataSource(this.customerService, snackBar);

    this.documentFilterFormControl = new FormControl(null);
    this.documentFilterFormControl.valueChanges.subscribe(() => this.loadCustomers());
  }

  ngAfterViewInit(): void {
    this.loadCustomers();
    this.paginator.page.subscribe(() => this.loadCustomers());
    this.sort.sortChange.subscribe(() => this.loadCustomers());
    this.cdr.detectChanges();
  }

  loadCustomers() {
    const status = (this.localStorageService.isTeacher) ? UserStatus.HA : null;
    this.dataSource.loadCustomers(this.documentFilterFormControl.value, status, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  addCustomer() {
    this.router.navigate(['registro/' + UserType.CUSTOMER])
  }

  detail(customer: Customer) {
    this.router.navigate(['usuario/detalle/' + customer.user.id]);
  }

  seeRoutines(customer: Customer) {
    this.router.navigate(['rutinas/' + customer.user.id]);
  }

  unsuscribeCustomer(customer: Customer) {
    this.updateUserStatusService.unsuscribeUser(customer.user.id).subscribe({
      next: () => {
        this.loadCustomers();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de baja al cliente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  suscribeCustomer(customer: Customer) {
    this.updateUserStatusService.suscribeUser(customer.user.id).subscribe({
      next: () => {
        this.loadCustomers();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de alta al cliente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  postPayment(customer: Customer) {
    const dialogRef = this.dialog.open(SuscriptionPaymentComponent, {
      width: '800px',
      data: { userId: customer.user.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadCustomers();
    });
  }

  isSuscribed(customer: Customer) {
    return customer.user.status.toString() == 'HA';
  }

  isExpireDateAfterToday(customer: Customer) {
    return new Date(customer.user.expireDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
  }

  get isAdministrator(): boolean {
    return this.localStorageService.isAdministrator;
  }

  get isTeacher(): boolean {
    return this.localStorageService.isTeacher;
  }
}
