import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../services/users/user.service';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from '../domain/user';
import { LocalstorageService } from '../services/auth/localstorage/localstorage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControlErrorResolverService } from '../util/form-control-error-resolver.service';
import { MY_DATE_FORMATS } from '../util/date.picker.formatter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatError,
    MatLabel,
    MatDialogActions,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    NgForOf,
    MatCardModule,
    DatePipe,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    DatePipe
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
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

  noEditedUser!: User;

  userId = 0;

  email = '';

  isEditable = false;
  isLoading = false;

  constructor(private userService: UserService, private localStorageService: LocalstorageService,
    private datePipe: DatePipe, private route: ActivatedRoute, private router: Router,
    private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
    });
    this.createFormGroup();
  }

  ngOnInit(): void {
    this.loadUserDataFromService();
  }

  createFormGroup() {
    this.emailFormControl = new FormControl('');
    this.firstNameFormControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]);
    this.lastNameFormControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z]+$/)]);
    this.phoneFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^\d+$/)]);
    this.bornDateFormControl = new FormControl(null, [Validators.required, this.minimumAgeValidator(18)]);
    this.countryFormControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);
    this.cityFormControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);
    this.districtFormControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]);
    this.addressFormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(80)]);
    this.documentTypeFormControl = new FormControl('');
    this.documentNumberFormControl = new FormControl('');

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

    this.formGroup.disable();
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

  setDataInFormControl(user: User): void {
    this.emailFormControl.setValue(user.email);
    this.firstNameFormControl.setValue(user.person.firstName);
    this.lastNameFormControl.setValue(user.person.lastName);
    this.phoneFormControl.setValue(user.person.phone);
    this.bornDateFormControl.setValue(new Date(user.person.bornDate));
    this.countryFormControl.setValue(user.person.country);
    this.cityFormControl.setValue(user.person.city);
    this.districtFormControl.setValue(user.person.district);
    this.addressFormControl.setValue(user.person.address);
    this.documentTypeFormControl.setValue(user.person.documentType);
    this.documentNumberFormControl.setValue(user.person.documetNumber);
  }

  loadUserDataFromService(): void {
    this.userService.getUserByUserId(this.userId).pipe(tap(user => this.email = user.email)).subscribe(user => {
      this.noEditedUser = user;
      this.setDataInFormControl(user);
    });
  }

  loadNoEditedUser(): void {
    this.setDataInFormControl(this.noEditedUser);
  }

  get isUserAvailableToEdit() {
    return this.localStorageService.authenticatedUserId == this.userId;
  }

  enableEdit(): void {
    this.enableDisableForm(true);
  }

  cancelEdit() {
    this.enableDisableForm(false);
    this.loadNoEditedUser();
  }

  enableDisableForm(enable: boolean) {
    this.isEditable = enable;
    if (enable) {
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }
  }

  saveUser(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const bornDate = this.datePipe.transform(this.formGroup.get('bornDate')?.value, 'dd/MM/yyyy') || '';
      const updatedUserRequest = {
        firstName: this.firstNameFormControl.value,
        lastName: this.lastNameFormControl.value,
        phone: this.phoneFormControl.value,
        bornDate: bornDate,
        country: this.countryFormControl.value,
        city: this.cityFormControl.value,
        district: this.districtFormControl.value,
        address: this.addressFormControl.value,
        documentType: this.documentTypeFormControl.value,
        documetNumber: this.documentNumberFormControl.value
      };

      this.userService.updateUser(updatedUserRequest).subscribe({
        next: () => {
          this.completeUserEdition('Se actualizaron correctamente los datos.');
        },
        error: () => {
          this.completeUserEdition('Ocurrió un error al intentar actualizar los datos.');
        }
      });
    }
  }

  completeUserEdition(message: string) {
    this.enableDisableForm(false);
    this.isLoading = false;
    this.snackBar.open(message, '', { duration: 5000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  changePassword() {
    this.router.navigate(['cambio-contrasenia'])
  }
}
