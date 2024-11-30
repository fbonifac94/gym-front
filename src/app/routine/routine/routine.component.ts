import { Component, OnInit } from '@angular/core';
import { RoutineService } from '../../services/routine/routine.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RoutineExercisesByExerciseType } from '../../domain/routine.exercises.by.exercise.type';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routine',
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
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './routine.component.html',
  styleUrl: './routine.component.css'
})
export class RoutineComponent implements OnInit {

  routineId = 0;

  aditionalInfo = '';

  userId = 0;

  displayedColumns: string[] = ['name', 'repetitions', 'series', 'observations'];

  exercisesGroupedByExerciseType$?: Observable<RoutineExercisesByExerciseType[]>;

  routineTitle = '';

  isLoading = false;

  constructor(private routineService: RoutineService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.routineId = params['routineId'];
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.exercisesGroupedByExerciseType$ = this.routineService.getRoutineByRoutineId(this.routineId).pipe(
      tap(routine => {
        this.routineTitle = routine.title;
        this.userId = routine.customer.user.id;
        this.aditionalInfo = routine.aditionalInfo;
      }),
      map(routine => {
        const exerciseTypes = routine.exercises.map(routineExercise => routineExercise.exercise.exerciseType).filter((value, index, self) =>
          index === self.findIndex((t) => t.id === value.id));
        return exerciseTypes.map(exerciseType_ => {
          return {
            exerciseType: exerciseType_,
            routineExercises: routine.exercises.filter(routineExercise => routineExercise.exercise.exerciseType.id == exerciseType_.id)
          }
        });
      })).pipe(catchError(error => {
        this.snackBar.open('Ocurrió un error al cargar la rutina.', '', {
          duration: 3000,
        });
        return of([]);
      }), tap(() => this.isLoading = false));
  }


  goBack() {
    this.router.navigate(['rutinas/' + this.userId])
  }
}
