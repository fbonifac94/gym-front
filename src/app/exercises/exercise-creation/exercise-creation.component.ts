import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExerciseTypeService } from '../../services/exercise-type/exercise-type.service';
import { MatOptionModule } from '@angular/material/core';
import { catchError, finalize, Observable } from 'rxjs';
import { ExerciseType } from '../../domain/exercise.type';
import { MatSelectModule } from '@angular/material/select';
import { ExercisesService } from '../../services/exercises/exercises.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormControlErrorResolverService } from '../../util/form-control-error-resolver.service';

@Component({
  selector: 'app-exercise-creation',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    NgIf,
    MatOptionModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exercise-creation.component.html',
  styleUrl: './exercise-creation.component.css'
})
export class ExerciseCreationComponent {

  exerciseForm!: FormGroup;

  exerciseTypeFormControl!: FormControl;
  exerciseNameFormControl!: FormControl;

  exerciseTypes$?: Observable<ExerciseType[]>;

  isLoading = false;

  constructor(private exerciseTypeService: ExerciseTypeService, private exercisesService: ExercisesService,
    public dialogRef: MatDialogRef<ExerciseCreationComponent>, private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService){
    this.isLoading = true
    this.exerciseTypes$ = this.exerciseTypeService.getExerciseTypes().pipe(
      catchError(error => {
        this.snackBar.open('Ocurrió un error al cargar los tipos de ejercicios.', '', {
          duration: 3000,
        });
        return [];
      }),
      finalize(() => this.isLoading = false)
    );
    this.createForm();
  }

  createForm() {
    this.exerciseTypeFormControl = new FormControl('', [Validators.required]);
    this.exerciseNameFormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(80), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]);

    this.exerciseForm = new FormGroup({
      exerciseType: this.exerciseTypeFormControl,
      name: this.exerciseNameFormControl
    });
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.exerciseForm, 'exerciseForm:' + formControlName);
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      this.isLoading = true
      const exerciseTypeId = this.exerciseTypeFormControl.value;
      const exerciseName = this.exerciseNameFormControl.value;
      this.exercisesService.createExercise(exerciseTypeId, exerciseName).pipe(finalize(()=> this.isLoading = false)).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Se creó el ejercicio correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        },
        error: () => {
          this.snackBar.open('Ocurrió un error al intentar crear ejercicio.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false); 
  }
}
