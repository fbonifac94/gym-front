import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RoutineService } from '../../services/routine/routine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineDataSource } from './routine.datasource';
import { tap } from 'rxjs';
import { Routine } from '../../domain/routine';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { MatCommonModule } from '@angular/material/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, MatSort, MatCommonModule,
    NgIf, MatProgressSpinnerModule, AsyncPipe, DatePipe],
  templateUrl: './routine-list.component.html',
  styleUrl: './routine-list.component.css'
})
export class RoutineListComponent implements AfterViewInit {

  displayedColumns: string[] = ['title', 'creationDate', 'modificationDate', 'actions'];
  dataSource: RoutineDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  private userId: number = 0;

  constructor(private routineService: RoutineService, private localStorageService: LocalstorageService, private router: Router,
    private route: ActivatedRoute, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
    });
    this.dataSource = new RoutineDataSource(this.routineService, snackBar);
  }

  ngAfterViewInit(): void {
    this.loadRoutines();
    this.paginator.page.subscribe(() => this.loadRoutines());
    this.sort.sortChange.subscribe(() => this.loadRoutines());
    this.cdr.detectChanges();
  }

  loadRoutines() {
    this.dataSource.loadRoutines(this.userId, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  createRoutine() {
    this.router.navigate(['rutinas/rutina/creacion/' + this.userId]);
  }

  deleteRoutine(routine: Routine) {
    this.routineService.deleteRoutine(routine.id).subscribe({
      next: () => {
        this.loadRoutines();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de baja la rutina.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  get isTeacher(): boolean {
    return this.localStorageService.isTeacher;
  }

  seeRoutine(routine: Routine) {
    this.router.navigate(['rutinas/rutina/' + routine.id]);
  }

  modifyRoutine(routine: Routine) {
    this.router.navigate(['rutinas/rutina/' + routine.id + '/edicion']);
  }

}
