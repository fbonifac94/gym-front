import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SuscriptionExpireDatePipe } from '../../pipes/suscription-expire-date.pipe';
import { StatusPipe } from '../../pipes/status.pipe';
import { ScheduledClassesDataSource } from './scheduled-classes.datasource';
import { ScheduledClassesService } from '../../services/scheduled-classes/scheduled-classes.service';
import { LocalstorageService } from '../../services/auth/localstorage/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClassesInscriptionService } from '../../services/classes-inscription/classes-inscription.service';
import { finalize } from 'rxjs';
import { ClassesInscriptionsComponent } from '../classes-inscriptions/classes-inscriptions.component';
import { ScheduledClass } from '../../domain/class.scheduled';
import { ScheduledClaszInscription } from '../../domain/scheduled.clasz.inscription';

@Component({
  selector: 'app-scheduled-classes',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator,
    MatSort, NgIf, MatLabel, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, DatePipe,
    MatProgressSpinnerModule, AsyncPipe, SuscriptionExpireDatePipe, TitleCasePipe, StatusPipe],

  templateUrl: './scheduled-classes.component.html',
  styleUrl: './scheduled-classes.component.css'
})
export class ScheduledClassesComponent implements AfterViewInit {
  displayedColumns: string[];
  dataSource: ScheduledClassesDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  isLoading = false;

  enrolledClasses: ScheduledClaszInscription[] = [];

  constructor(private scheduledClassesService: ScheduledClassesService, private localStorageService: LocalstorageService,
    private cdr: ChangeDetectorRef, private classesInscriptionService: ClassesInscriptionService, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) {
    this.displayedColumns = ['name', 'initDateTime', 'endDateTime', 'teacher', 'actualClassPersonsAmount', 'actions'];
    if (this.localStorageService.isTeacher) {
      this.displayedColumns = this.displayedColumns.filter(elem => elem != 'teacher');
    }


    this.dataSource = new ScheduledClassesDataSource(this.scheduledClassesService, this.localStorageService, snackBar);
  }

  ngAfterViewInit(): void {
    this.loadScheduledClaszes();
    this.paginator.page.subscribe(() => this.loadScheduledClaszes());
    this.sort.sortChange.subscribe(() => this.loadScheduledClaszes());
    this.cdr.detectChanges();
  }

  loadScheduledClaszes(): void {
    if (this.isCustomer) {
      this.isLoading = true;
      this.classesInscriptionService.getInscriptionsFromCustomerByUserId(this.localStorageService.authenticatedUserId).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: response => this.enrolledClasses = response
      });
    }

    this.dataSource.loadScheduledClaszes(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  getAsDate(date: string[]): Date {
    const date_ = new Date();
    date_.setFullYear(Number(date[0]));
    date_.setMonth(Number(date[1]));
    date_.setDate(Number(date[2]));
    date_.setHours(Number(date[3]));
    date_.setMinutes(Number(date[4]));
    return date_;
  }

  eraseInscriptionClass(scheduledClaszId: number) {
    this.isLoading = true;
    this.classesInscriptionService.eraseInscriptionClass(scheduledClaszId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: () => {
        this.loadScheduledClaszes();
      },
      error: () => { }
    });
  }

  enrollToClass(scheduledClaszId: number) {
    this.isLoading = true;
    this.classesInscriptionService.enrollToClass(scheduledClaszId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: () => {
        this.loadScheduledClaszes();
      },
      error: () => { }
    });
  }

  get isCustomer(): boolean {
    return this.localStorageService.isCustomer;
  }

  isEnrolledToScheduledClass(scheduledClasz: ScheduledClass): boolean {
    return this.enrolledClasses.map(elem => elem.scheduledClasz.id).includes(scheduledClasz.id);
  }


  seeInscriptions(scheduledClasz: ScheduledClass) {
    this.dialog.open(ClassesInscriptionsComponent, {
      width: '500px',
      data: {
        scheduledClaszName: scheduledClasz.clasz.name,
        scheduledClaszId: scheduledClasz.id
      }
    });
  }

  cancelClass(scheduledClaszId: number) {
    this.isLoading = true;
    this.scheduledClassesService.cancelScheduledClasses(scheduledClaszId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: () => {
        this.loadScheduledClaszes();
      },
      error: () => { }
    });
  }

}
