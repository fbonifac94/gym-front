import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RoutineExercisesByExerciseType } from '../domain/routine.exercises.by.exercise.type';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { ExerciseType } from '../domain/exercise.type';
import { ExercisesService } from '../services/exercises/exercises.service';
import { ExercisesByExerciseType } from '../domain/exercise.by.exercise.type';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseTypeCreationComponent } from './exercise-type-creation/exercise-type-creation.component';
import { ExerciseTypeService } from '../services/exercise-type/exercise-type.service';
import { Exercise } from '../domain/exercise';
import { ExerciseCreationComponent } from './exercise-creation/exercise-creation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})
export class ExercisesComponent {

  exercisesGroupedByExerciseType$?: Observable<ExercisesByExerciseType[]>;

  exerciseTypes: ExerciseType[] = [];

  isLoading = false;

  constructor(private exercisesService: ExercisesService, private exerciseTypeService: ExerciseTypeService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.exercisesGroupedByExerciseType$ = this.exercisesService.getExercisesGroupedByExerciseType().pipe(
      catchError(error => {
        this.snackBar.open('Ocurrió un error al cargar los ejercicios existentes.', '', {
          duration: 3000,
        });
        return [];
      }),
      finalize(() => this.isLoading = false)
    );
  }

  onAddExerciseType() {
    const dialogRef = this.dialog.open(ExerciseTypeCreationComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  onAddExercise() {
    const dialogRef = this.dialog.open(ExerciseCreationComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  onDeleteExerciseType(exerciseType: ExerciseType) {
    this.exerciseTypeService.deleteExerciseType(exerciseType.id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar eliminar el tipo de ejercicio.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  onDeleteExercise(exercise: Exercise) {
    this.exercisesService.deleteExercise(exercise.id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar eliminar el ejercicio.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

}
