import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from '../../services/routine/routine.service';
import { ExercisesService } from '../../services/exercises/exercises.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { RoutineExercisesByExerciseType } from '../../domain/routine.exercises.by.exercise.type';
import { RoutineCreation } from '../../domain/routine.creation';
import { Routine } from '../../domain/routine';
import { RoutineExercise } from '../../domain/routine.exercise';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RoutineExerciseCreation } from '../../domain/routine.exercise.creation';
import { ExercisesByExerciseType } from '../../domain/exercise.by.exercise.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-routine-edit',
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
  templateUrl: './routine-edit.component.html',
  styleUrl: './routine-edit.component.css'
})
export class RoutineEditComponent {

  aditionalInfoFormControl: FormControl;

  displayedColumns: string[] = ['select', 'name', 'repetitions', 'series', 'observations'];

  exercisesGroupedByExerciseType$: Observable<RoutineExercisesByExerciseType[]>;

  routine: RoutineCreation = { title: '', exercises: [], aditionalInfo: '' };

  routineId = 0;

  userId = 0;

  isLoading = false;

  constructor(private exercisesService: ExercisesService, private routineService: RoutineService, private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.routineId = params['routineId'];
    });

    this.aditionalInfoFormControl = new FormControl('');
    this.aditionalInfoFormControl.valueChanges.subscribe({
      next: elem => this.routine.aditionalInfo = elem
    });

    this.exercisesGroupedByExerciseType$ = this.loadExercisesWithRoutineData()
      .pipe(
        tap(() => this.isLoading = false),
        catchError(error => {
          this.snackBar.open('Ocurrió un error al cargar la rutina.', '', {
            duration: 3000,
          });
          return of([]);
        }),
      );

  }

  loadExercisesWithRoutineData(): Observable<RoutineExercisesByExerciseType[]> {
    this.isLoading = true;
    return this.exercisesService.getExercisesGroupedByExerciseType().pipe(
      switchMap((exercisesByType: ExercisesByExerciseType[]) =>
        this.routineService.getRoutineByRoutineId(this.routineId).pipe(
          map((routine: Routine) => {
            this.routine.title = routine.title;
            this.routine.aditionalInfo = routine.aditionalInfo;
            this.userId = routine.customer.user.id;
            return exercisesByType.filter(elem => elem.exercises.length > 0).map(exerciseType => ({
              exerciseType: exerciseType.exerciseType,
              routineExercises: exerciseType.exercises.map(exercise => {
                const matchedRoutineExercise = routine.exercises.find(routineExercise => exercise.id == routineExercise.exercise.id);
                if (matchedRoutineExercise) {
                  this.routine.exercises.push({
                    exercise: matchedRoutineExercise.exercise,
                    repetitions: matchedRoutineExercise.repetitions,
                    series: matchedRoutineExercise.series,
                    aditionalInfo: matchedRoutineExercise.aditionalInfo
                  });
                }
                return {
                  id: matchedRoutineExercise ? matchedRoutineExercise.id : 0,
                  exercise,
                  repetitions: matchedRoutineExercise ? matchedRoutineExercise.repetitions : 0,
                  series: matchedRoutineExercise ? matchedRoutineExercise.series : 0,
                  aditionalInfo: matchedRoutineExercise ? matchedRoutineExercise.aditionalInfo : ''
                } as RoutineExercise;
              })
            })) as RoutineExercisesByExerciseType[];
          })
        )
      )
    );
  }

  isInRoutine(routineExercise: RoutineExerciseCreation): boolean {
    return this.routine.exercises.length === 0
      ? false
      : this.routine.exercises.map((elem) => elem.exercise.id).includes(routineExercise.exercise.id);
  }

  isAvailableToSaveRoutine() {
    return this.isRoutineEmpty() ||
      this.routine.exercises.map(elem => elem.repetitions).includes(0) ||
      this.routine.exercises.map(elem => elem.series).includes(0);
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
    this.routineService.updateRoutine(this.routineId, this.routine).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.router.navigate(['rutinas/' + this.userId]);
        this.snackBar.open('Se guardaron los cambios de la rutina correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
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
