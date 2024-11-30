import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SuscriptionPaymentService } from '../services/suscription-payment/suscription-payment.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { SuscriptionPaymentDataSource } from './suscription-payment.datasource';
import { PostSuscriptionPaymentRequest } from '../domain/request/post.suscription.request';
import { MatSelectModule } from '@angular/material/select';
import { SuscriptionTimeUnits } from '../domain/enum/suscription.time.units';
import { SuscriptionTimeUnitsPipe } from '../pipes/suscription-time-units.pipe';
import { SuscriptionPayment } from '../domain/suscription.payment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControlErrorResolverService } from '../util/form-control-error-resolver.service';

@Component({
  selector: 'app-suscription-payment',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, NgIf, MatInputModule,
    MatFormFieldModule, ReactiveFormsModule, MatIcon, MatError, MatButtonModule, MatDialogModule, MatOptionModule, DatePipe, CurrencyPipe,
    MatSelectModule, NgFor, SuscriptionTimeUnitsPipe, MatProgressSpinnerModule, AsyncPipe],

  templateUrl: './suscription-payment.component.html',
  styleUrl: './suscription-payment.component.css'
})
export class SuscriptionPaymentComponent implements AfterViewInit {
  paymentForm!: FormGroup;

  amountFormControl!: FormControl;
  timeUnitFormControl!: FormControl;
  paymentAmountFormControl!: FormControl;

  timeUnits = [{ value: SuscriptionTimeUnits.DAY, viewValue: 'Días' },
  { value: SuscriptionTimeUnits.MONTH, viewValue: 'Meses' },
  { value: SuscriptionTimeUnits.YEAR, viewValue: 'Años' }];

  dataSource: SuscriptionPaymentDataSource

  displayedColumns: string[] = ['paymentAmount', 'timePaid', 'paymentDate', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  userId = 0;

  constructor(private suscriptionPaymentService: SuscriptionPaymentService, private dialogRef: MatDialogRef<SuscriptionPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }, private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {
    this.userId = data.userId;
    this.createForm();
    this.dataSource = new SuscriptionPaymentDataSource(suscriptionPaymentService, snackBar);
  }

  ngAfterViewInit(): void {
    this.loadSuscriptionPayment();
    this.paginator.page.subscribe(() => this.loadSuscriptionPayment());
  }

  loadSuscriptionPayment() {
    this.dataSource.loadSuscriptionPaymentByUserId(this.userId, this.paginator.pageIndex, this.paginator.pageSize);
  }

  createForm() {
    this.amountFormControl = new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)]);
    this.timeUnitFormControl = new FormControl(null, [Validators.required]);
    this.paymentAmountFormControl = new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]);

    this.paymentForm = new FormGroup({
      amount: this.amountFormControl,
      timeUnit: this.timeUnitFormControl,
      paymentAmount: this.paymentAmountFormControl
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const request: PostSuscriptionPaymentRequest = {
        amount: this.paymentAmountFormControl.value,
        suscriptionQuantity: this.amountFormControl.value,
        susucriptionQuantityTimeUnits: this.timeUnitFormControl.value
      };
      this.suscriptionPaymentService.postSuscriptionPayment(this.userId, request).subscribe({
        next: () => {
          this.loadSuscriptionPayment();
          this.paymentForm.reset();
          this.snackBar.open('Se registró el pago correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        },
        error: () => {
          this.snackBar.open('Ocurrió un error al registrar el pago.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }
      });
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.paymentForm, 'paymentForm:' + formControlName);
  }

  onCancel() {
    this.dialogRef.close();
  }

  deletePayment(suscriptionPayment: SuscriptionPayment): void {
    this.suscriptionPaymentService.deleteSuscriptionPayment(suscriptionPayment.id).subscribe({
      next: () => {
        this.loadSuscriptionPayment();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al dar de baja el pago.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }
}
