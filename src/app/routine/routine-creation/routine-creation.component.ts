import { Component } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ExercisesService } from '../../services/exercises/exercises.service';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoutineService } from '../../services/routine/routine.service';
import { RoutineExercisesByExerciseType } from '../../domain/routine.exercises.by.exercise.type';
import { RoutineCreation } from '../../domain/routine.creation';
import { RoutineExerciseCreation } from '../../domain/routine.exercise.creation';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routine-creation',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './routine-creation.component.html',
  styleUrl: './routine-creation.component.css',
})
export class RoutineCreationComponent {

  routineTitleFormControl: FormControl;

  aditionalInfoFormControl: FormControl;

  displayedColumns: string[] = ['select', 'name', 'repetitions', 'series', 'observations'];

  exercisesGroupedByExerciseType$: Observable<RoutineExercisesByExerciseType[]>;

  routine: RoutineCreation = { title: '', exercises: [], aditionalInfo: '' };

  private userId: number = 0;

  isLoading = false;

  constructor(private exercisesService: ExercisesService, private routineService: RoutineService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
    });
    this.routineTitleFormControl = new FormControl('', Validators.required);
    this.routineTitleFormControl.valueChanges.subscribe({
      next: elem => this.routine.title = elem
    });

    this.aditionalInfoFormControl = new FormControl('');
    this.aditionalInfoFormControl.valueChanges.subscribe({
      next: elem => this.routine.aditionalInfo = elem
    });

    this.isLoading = true;
    this.exercisesGroupedByExerciseType$ =
      this.exercisesService.getExercisesGroupedByExerciseType().pipe(map(exercisesByExerciseTypeResponse => {
        return exercisesByExerciseTypeResponse.filter(elem => elem.exercises.length > 0).map(exercisesByExerciseType => {
          return {
            exerciseType: exercisesByExerciseType.exerciseType,
            routineExercises: exercisesByExerciseType.exercises.map(exercise => {
              return { id: 0, exercise: exercise, repetitions: 0, series: 0, aditionalInfo: '' }
            })
          }
        });
      })).pipe(
        tap(() => this.isLoading = false),
        catchError(error => {
          this.snackBar.open('Ocurrió un error al cargar la rutina.', '', {
            duration: 3000,
          });
          return of([]);
        }),
      );
  }

  isInRoutine(routineExercise: RoutineExerciseCreation): Boolean {
    return this.routine.exercises.length === 0
      ? false
      : this.routine.exercises.map((elem) => elem.exercise).includes(routineExercise.exercise);
  }

  isAvailableToSaveRoutine() {
    return this.isRoutineEmpty() ||
      this.routineTitleFormControl.invalid ||
      this.routine.exercises.map(elem => elem.repetitions).includes(0) ||
      this.routine.exercises.map(elem => elem.series).includes(0) || this.routineTitleFormControl.invalid;
  }

  refreshRoutineExercise(routineExercise: RoutineExerciseCreation) {
    if (!routineExercise.repetitions) {
      routineExercise.repetitions = 0;
    }

    if (!routineExercise.series) {
      routineExercise.series = 0;
    }

    this.removeFromRoutine(routineExercise);
    this.addToRoutine(routineExercise);
  }

  addRemoveToRoutine(checked: boolean, routineExercise: RoutineExerciseCreation) {
    if (checked) {
      this.routine.exercises.push(routineExercise);
    } else {
      this.routine.exercises = this.routine.exercises.filter(
        (elem) => elem.exercise.id !== routineExercise.exercise.id
      );
    }
  }

  addToRoutine(routineExercise: RoutineExerciseCreation) {
    this.routine.exercises.push(routineExercise);
  }

  removeFromRoutine(routineExercise: RoutineExerciseCreation) {
    this.routine.exercises = this.routine.exercises.filter(
      (elem) => elem.exercise.id !== routineExercise.exercise.id
    );
  }

  isRoutineEmpty(): Boolean {
    return this.routine.exercises.length < 1;
  }

  saveRoutine() {
    this.isLoading = true;
    this.routineService.createRoutine(this.userId, this.routine).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.router.navigate(['rutinas/' + this.userId]);
        this.snackBar.open('Se creó la rutina correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      },
      error: (error) => {
        this.snackBar.open('Ocurrió un error al guardar la rutina.', '', {
          duration: 3000,
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['rutinas/' + this.userId]);
  }

  isRoutineFormIncomplete(): boolean {
    return !this.isRoutineEmpty() && (this.routine.exercises.map(elem => elem.repetitions).includes(0) ||
      this.routine.exercises.map(elem => elem.series).includes(0));
  }
}