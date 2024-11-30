import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../forgot-password/forgot-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControlErrorResolverService } from '../../util/form-control-error-resolver.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatError,
    NgIf,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formGroup: FormGroup;
  usernameFormControl: FormControl;
  passwordFormControl: FormControl;
  hide = true;

  isLoading: boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private localStorageService: LocalstorageService, public matDialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog, private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {
    this.usernameFormControl = new FormControl(null, [Validators.required, Validators.email]);
    this.passwordFormControl = new FormControl(null, [Validators.required]);

    this.formGroup = new FormGroup({
      username: this.usernameFormControl,
      password: this.passwordFormControl,
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      this.authenticationService
        .login({ email: this.usernameFormControl.value, password: this.passwordFormControl.value, })
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          {
            next: (elem) => {
              this.localStorageService.saveTokenOnLocalStorage(elem?.token);
              this.matDialogRef.close(true);
            },
            error: (error) => {
              this.snackBar.open('Las credenciales son incorrectas o el usuario se encuentra bloqueado.', '',
                { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
              this.formGroup.reset();
            }
          }
        );
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.formGroup, 'loginForm:' + formControlName);
  }

  openPasswordRecoveryDialog() {
    this.matDialogRef.close();
    this.dialog.open(ForgotPasswordComponent, {
      
    });
  }
}
