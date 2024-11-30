import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ExerciseTypeService } from '../../services/exercise-type/exercise-type.service';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { FormControlErrorResolverService } from '../../util/form-control-error-resolver.service';

@Component({
  selector: 'app-exercise-type-creation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    NgIf,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exercise-type-creation.component.html',
  styleUrl: './exercise-type-creation.component.css'
})
export class ExerciseTypeCreationComponent {
  exerciseTypeForm!: FormGroup;
  exerciseTypeFormControl!: FormControl;

  isLoading = false;

  constructor(private exerciseTypeService: ExerciseTypeService, private dialogRef: MatDialogRef<ExerciseTypeCreationComponent>,
    private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {
    this.createForm();
  }

  createForm() {
    this.exerciseTypeFormControl = new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);

    this.exerciseTypeForm = new FormGroup({
      name: this.exerciseTypeFormControl
    })
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.exerciseTypeForm, 'exerciseTypeForm:' + formControlName);
  }

  onSubmit() {
    if (this.exerciseTypeForm.valid) {
      this.isLoading = true;
      this.exerciseTypeService.createExerciseType(this.exerciseTypeFormControl.value).pipe(finalize(()=> this.isLoading = false)).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Se creó el tipo de ejercicio correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        },
        error: () => {
          this.snackBar.open('Ocurrió un error al intentar crear el tipo de ejercicio.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }
      });

    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
