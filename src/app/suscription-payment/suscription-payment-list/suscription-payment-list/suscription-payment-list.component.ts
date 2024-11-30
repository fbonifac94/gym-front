import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SuscriptionPaymentListDataSource } from './suscription-payment-list.datasource';
import { SuscriptionPaymentService } from '../../../services/suscription-payment/suscription-payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, CurrencyPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../util/date.picker.formatter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SuscriptionTimeUnitsPipe } from '../../../pipes/suscription-time-units.pipe';

@Component({
  selector: 'app-suscription-payment-list',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, TitleCasePipe, CurrencyPipe, MatDatepickerModule,
    NgIf, MatLabel, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, DatePipe, MatProgressSpinnerModule, AsyncPipe, SuscriptionTimeUnitsPipe],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    DatePipe
  ],
  templateUrl: './suscription-payment-list.component.html',
  styleUrl: './suscription-payment-list.component.css'
})
export class SuscriptionPaymentListComponent {

  documentFilterFormControl!: FormControl;

  startDateFormControl!: FormControl;

  endDateFormControl!: FormControl;

  dataSource: SuscriptionPaymentListDataSource;

  displayedColumns: string[] = ['name', 'document', 'amount', 'quantity', 'date'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  userId = 0;

  constructor(private suscriptionPaymentService: SuscriptionPaymentService, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private datePipe: DatePipe) {
    this.dataSource = new SuscriptionPaymentListDataSource(this.suscriptionPaymentService, this.snackBar);

    this.documentFilterFormControl = new FormControl(null);
    this.startDateFormControl = new FormControl(null);
    this.endDateFormControl = new FormControl(null);
    this.documentFilterFormControl.valueChanges.subscribe(() => this.loadSuscriptionPayments());
    this.startDateFormControl.valueChanges.subscribe(() => this.loadSuscriptionPayments());
    this.endDateFormControl.valueChanges.subscribe(() => this.loadSuscriptionPayments());
  }

  ngAfterViewInit(): void {
    this.loadSuscriptionPayments();
    this.paginator.page.subscribe(() => this.loadSuscriptionPayments());
    this.cdr.detectChanges();
  }

  loadSuscriptionPayments() {
    let startDate = null;
    if (this.startDateFormControl.value) {
      startDate = this.datePipe.transform(this.startDateFormControl.value, 'dd/MM/yyyy');
    }

    let endDate = null;
    if (this.endDateFormControl.value) {
      endDate = this.datePipe.transform(this.endDateFormControl.value, 'dd/MM/yyyy');
    }

    this.dataSource.loadSuscriptionPayment(this.documentFilterFormControl.value, startDate, endDate,
      this.paginator.pageIndex, this.paginator.pageSize);
  }

  clearFilters() {
    this.documentFilterFormControl.reset();
    this.startDateFormControl.reset();
    this.endDateFormControl.reset();
  }
}
