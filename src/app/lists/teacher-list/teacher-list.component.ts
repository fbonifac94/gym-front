import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TeacherDataSource } from './teacher.datasource';
import { Customer } from '../../domain/customer';
import { Router } from '@angular/router';
import { TeacherService } from '../../services/teachers/teachers.service';
import { UserType } from '../../domain/enum/user-types';
import { UpdateUserStatusService } from '../../services/update-status-user/update-status-user.service';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { UserStatusPipe } from '../../user-status-pipe/user-status.pipe';
import { Teacher } from '../../domain/teacher';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator, MatSort, TitleCasePipe,
    UserStatusPipe, NgIf, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css',
})
export class TeacherListComponent implements AfterViewInit {

  documentFilterFormControl!: FormControl;

  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'documentNumber', 'status', 'actions'];
  dataSource: TeacherDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private teacherService: TeacherService, private updateUserStatusService: UpdateUserStatusService, private router: Router,
    private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    this.dataSource = new TeacherDataSource(this.teacherService, snackBar);

    this.documentFilterFormControl = new FormControl(null);
    this.documentFilterFormControl.valueChanges.subscribe(() => this.loadTeachers());
  }

  ngAfterViewInit(): void {
    this.loadTeachers();
    this.paginator.page.subscribe(() => this.loadTeachers());
    this.sort.sortChange.subscribe(() => this.loadTeachers());
    this.cdr.detectChanges();
  }

  loadTeachers() {
    this.dataSource.loadTeachers(this.documentFilterFormControl.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  addTeacher() {
    this.router.navigate(['registro/' + UserType.TEACHER])
  }

  detail(teacher: Teacher) {
    this.router.navigate(['usuario/detalle/' + teacher.user.id]);
  }

  unsuscribeTeacher(teacher: Teacher) {
    this.updateUserStatusService.unsuscribeUser(teacher.user.id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de baja al profesor.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  suscribeTeacher(teacher: Teacher) {
    this.updateUserStatusService.suscribeUser(teacher.user.id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar dar de alta al profesor.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  isSuscribed(teacher: Teacher) {
    return teacher.user.status.toString() == 'HA';
  }

}
