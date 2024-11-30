import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserType } from '../../domain/enum/user-types';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FormControlErrorResolverService } from '../../util/form-control-error-resolver.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatError,
    MatLabel,
    MatDialogActions,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    NgIf,
    MatSelectModule,
    MatOptionModule,
    NgForOf,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    DatePipe
  ],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  userType = UserType.CUSTOMER;

  formGroup!: FormGroup;

  emailFormControl!: FormControl;
  firstNameFormControl!: FormControl;
  lastNameFormControl!: FormControl;
  phoneFormControl!: FormControl;
  bornDateFormControl!: FormControl;
  countryFormControl!: FormControl;
  cityFormControl!: FormControl;
  districtFormControl!: FormControl;
  addressFormControl!: FormControl;
  documentTypeFormControl!: FormControl;
  documentNumberFormControl!: FormControl;

  documentTypes = [
    'DNI', 'Pasaporte'
  ];

  isLoading = false;

  constructor(private registerService: RegisterService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar,
    private datePipe: DatePipe, private formControlErrorResolver: FormControlErrorResolverService) {
    this.route.params.subscribe(params => this.userType = params['userType']);
    this.buildRegisterForm();
  }

  ngOnInit(): void { }

  buildRegisterForm(): void {
    this.emailFormControl = new FormControl("", [Validators.required, Validators.maxLength(50), Validators.email]);
    this.firstNameFormControl = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]);
    this.lastNameFormControl = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]);
    this.phoneFormControl = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^\d+$/)]);
    this.bornDateFormControl = new FormControl("", [Validators.required, this.minimumAgeValidator(18)]);
    this.countryFormControl = new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);
    this.cityFormControl = new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);
    this.districtFormControl = new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]);
    this.addressFormControl = new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(80)]);
    this.documentTypeFormControl = new FormControl("", [Validators.required]);
    this.documentNumberFormControl = new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^\d+$/)]);

    this.formGroup = new FormGroup({
      email: this.emailFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      phone: this.phoneFormControl,
      bornDate: this.bornDateFormControl,
      country: this.countryFormControl,
      city: this.cityFormControl,
      district: this.districtFormControl,
      address: this.addressFormControl,
      documentType: this.documentTypeFormControl,
      documentNumber: this.documentNumberFormControl
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const bornDate = this.datePipe.transform(this.formGroup.get('bornDate')?.value, 'dd/MM/yyyy') || '';

      this.registerService.register(this.userType, {
        email: this.formGroup.get('email')?.value,
        firstName: this.formGroup.get('firstName')?.value,
        lastName: this.formGroup.get('lastName')?.value,
        phone: this.formGroup.get('phone')?.value,
        bornDate: bornDate,
        country: this.formGroup.get('country')?.value,
        city: this.formGroup.get('city')?.value,
        district: this.formGroup.get('district')?.value,
        address: this.formGroup.get('address')?.value,
        documentType: this.formGroup.get('documentType')?.value,
        documentNumber: this.formGroup.get('documentNumber')?.value
      }).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: () => {
          this.snackBar.open('Se creó el usuario correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
          this.redirectTo();
        },
        error: errorResponse => {
          if (errorResponse.error && errorResponse.error.code === 100) {
            this.snackBar.open(errorResponse.error.errorMessage, '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });  
          } else {
            this.snackBar.open('Ocurrió un error en la creación del usuario.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
          }
        },
      });
    }
  }

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      
      const age = today.getFullYear() - birthDate.getFullYear();
      const isBirthdayPassed = today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
      if (isNaN(birthDate.getTime())) {
        return { invalidDate: true };
      }
      
      return age > minAge || (age === minAge && isBirthdayPassed) ? null : { underage: true };
    };
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.formGroup, 'registerForm:' + formControlName);
  }

  onCancel() {
    this.redirectTo();
  }

  redirectTo() {
    if (this.userType == UserType.CUSTOMER) {
      this.router.navigate(['clientes']);
      return;
    }
    if (this.userType == UserType.ADMIN) {
      this.router.navigate(['administradores']);
      return;
    }
    if (this.userType == UserType.TEACHER) {
      this.router.navigate(['profesores']);
      return;
    }
    this.router.navigate(['']);
  }
}