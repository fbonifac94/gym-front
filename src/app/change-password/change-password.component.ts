import { Component } from '@angular/core';
import { AbstractControl, Form, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { ChangePasswordService } from '../services/change-password/change-password.service';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/auth/localstorage/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControlErrorResolverService } from '../util/form-control-error-resolver.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  changePasswordForm!: FormGroup;

  currentPasswordFormControl!: FormControl;
  newPasswordFormControl!: FormControl;
  confirmPasswordFormControl!: FormControl;

  isLoading = false;

  hideNewPass = true;
  hideOldPass = true;
  hideConfirmPass = true;

  constructor(private changePasswordService: ChangePasswordService, private localStorageService: LocalstorageService,
    private router: Router, private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {
    this.createForm();
  }

  createForm() {
    this.currentPasswordFormControl = new FormControl('', Validators.required);
    this.newPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]);
    this.confirmPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]);


    this.newPasswordFormControl.valueChanges.subscribe({
      next: () => this.changePasswordForm.updateValueAndValidity()
    });

    this.confirmPasswordFormControl.valueChanges.subscribe({
      next: () => this.changePasswordForm.updateValueAndValidity()
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: this.currentPasswordFormControl,
      newPassword: this.newPasswordFormControl,
      confirmPassword: this.confirmPasswordFormControl
    }, { validators: this.checkPasswords() });
  }

  checkPasswords(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: boolean } | null => {
      const newPassword = this.newPasswordFormControl.value;
      const confirmPassword = this.confirmPasswordFormControl.value;

      if (newPassword != confirmPassword) {
        this.confirmPasswordFormControl.setErrors({ notMatching: true });
        return { notMatching: true };
      }
      this.confirmPasswordFormControl.setErrors(null);
      return null;
    };
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.changePasswordForm, 'changePasswordForm:' + formControlName);
  }

  onSubmit() {
    if (this.changePasswordForm?.valid) {
      this.isLoading = true;
      this.changePasswordService.updatePassword(this.currentPasswordFormControl?.value, this.newPasswordFormControl?.value).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.localStorageService.cerrarSesion();
            this.router.navigate(['']);
            this.snackBar.open('Se actualizó correctamente la contraseña.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
          },
          error: (errorResponse) => {
            if (errorResponse.error && errorResponse.error.code === 101) {
              this.snackBar.open(errorResponse.error.errorMessage, '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
            } else {
              this.snackBar.open('Ocurrió un error al intentar realizar el cambio de contraseña.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
            }
          }
        });
    }
  }
}
