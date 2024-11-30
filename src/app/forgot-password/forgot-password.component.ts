import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { FormControlErrorResolverService } from '../util/form-control-error-resolver.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatFormField,
    MatError,
    MatLabel,
    NgIf,
    MatProgressSpinnerModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  emailForm!: FormGroup;
  emailFormControl!: FormControl;

  codeForm!: FormGroup;
  codeFormControl!: FormControl;

  passwordForm!: FormGroup;
  newPasswordFormControl!: FormControl;
  confirmPasswordFormControl!: FormControl;

  @ViewChild(MatStepper, { static: true }) private stepper!: MatStepper;

  isLoading: boolean = false;

  constructor(private forgotPasswordService: ForgotPasswordService, public matDialogRef: MatDialogRef<ForgotPasswordComponent>, private formControlErrorResolver: FormControlErrorResolverService) {
    this.createEmailForm();
    this.createCodeForm();
    this.createPasswordForm();
  }

  createEmailForm() {
    this.emailFormControl = new FormControl(null, [Validators.required, Validators.email])
    this.emailForm = new FormGroup({
      email: this.emailFormControl
    });
  }

  getErrorMessageForEmailForm(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.emailForm, 'emailForgotPasswordForm:' + formControlName);
  }

  createCodeForm() {
    this.codeFormControl = new FormControl(null, [Validators.required]);
    this.codeForm = new FormGroup({
      code: this.codeFormControl
    });
  }

  getErrorMessageForCodeForm(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.codeForm, 'codeForgotPasswordForm:' + formControlName);
  }

  createPasswordForm() {
    this.newPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]);
    this.confirmPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]);
    this.passwordForm = new FormGroup({
      newPassword: this.newPasswordFormControl,
      confirmPassword: this.confirmPasswordFormControl
    }, { validators: this.checkPasswords() })

    this.newPasswordFormControl.valueChanges.subscribe(() => {
      this.passwordForm.updateValueAndValidity();
    });

    this.confirmPasswordFormControl.valueChanges.subscribe(() => {
      this.passwordForm.updateValueAndValidity();
    });
  }

  getErrorMessageForPasswordForm(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.passwordForm, 'passwordForgotPasswordForm:' + formControlName);
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

  onEmailStepSubmit(): void {
    if (this.emailForm.valid) {
      const email = this.emailFormControl.value;
      this.isLoading = true;
      this.forgotPasswordService.generatePasswordRecuperationCode(email).pipe(finalize(()=> this.isLoading = false)).subscribe({
        next: () => {
          this.stepper.next();
        },
        error: () => {
          this.emailForm.get('email')?.setErrors({ serverError: true });
        },
      });
    }
  }

  onCodeStepSubmit(): void {
    if (this.codeForm.valid) {
      const email = this.emailFormControl.value;
      const code = this.codeFormControl.value;
      this.isLoading = true;
      this.forgotPasswordService.validatePasswordRecuperationCode(email, code).pipe(finalize(()=> this.isLoading = false)).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.stepper.next();
          } else {
            this.codeForm.get('code')?.setErrors({ invalidCode: true });
          }
        },
        error: () => {
          this.codeForm.get('code')?.setErrors({ serverError: true });
        }
      });
    }
  }

  onPasswordStepSubmit(): void {
    if (this.passwordForm.valid) {
      const email = this.emailFormControl.value;
      const code = this.codeFormControl.value;
      const password = this.newPasswordFormControl.value;
      this.isLoading = true;
      this.forgotPasswordService.updatePassword(email, code, password).pipe(finalize(()=> this.isLoading = false)).subscribe({
        next: () => {
          this.matDialogRef.close();
        },
        error: () => {
          this.passwordForm.get('newPassword')?.setErrors({ serverError: true });
        }
      });
    }
  }
}
