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
import { ClaszesService } from '../../services/classes/claszes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaszDataSource } from './classes-administration.datasource';
import { Router } from '@angular/router';
import { ClassesCreationComponent } from '../classes-creation/classes-creation.component';
import { StatusPipe } from '../../pipes/status.pipe';
import { Clasz } from '../../domain/clasz';

@Component({
  selector: 'app-classes-administration',
  standalone: true,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginator,
    MatSort, NgIf, MatLabel, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, DatePipe,
    MatProgressSpinnerModule, AsyncPipe, SuscriptionExpireDatePipe, TitleCasePipe, StatusPipe],
  templateUrl: './classes-administration.component.html',
  styleUrl: './classes-administration.component.css'
})
export class ClassesAdministrationComponent implements AfterViewInit {

  displayedColumns: string[];
  dataSource: ClaszDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private claszesService: ClaszesService, private cdr: ChangeDetectorRef, private dialog: MatDialog,
    private router: Router, private snackBar: MatSnackBar) {
    this.displayedColumns = ['name', 'day', 'initSchedule', 'endSchedule', 'amount', 'teacher', 'status', 'actions'];
    this.dataSource = new ClaszDataSource(this.claszesService, snackBar);
  }

  ngAfterViewInit(): void {
    this.loadClaszes();
    this.paginator.page.subscribe(() => this.loadClaszes());
    this.sort.sortChange.subscribe(() => this.loadClaszes());
    this.cdr.detectChanges();
  }

  loadClaszes(): void {
    this.dataSource.loadClaszes(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  addClass() {
    const dialogRef = this.dialog.open(ClassesCreationComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClaszes();
      }
    });
  }

  detail(clasz: Clasz) {
    const dialogRef = this.dialog.open(ClassesCreationComponent, {
      width: '800px',
      data: { clasz }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClaszes();
      }
    });
  }

  disableClasz(clasz: Clasz) {
    this.claszesService.disableClass(clasz.id).subscribe({
      next: () => {
        this.loadClaszes();
        this.snackBar.open('Se deshabilitó correctamente la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar deshabilitar la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  enableClasz(clasz: Clasz) {
    this.claszesService.enableClass(clasz.id).subscribe({
      next: () => {
        this.loadClaszes();
        this.snackBar.open('Se habilitó correctamente la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al intentar habilitar la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
  }

  canEnableClasz(clasz: Clasz): boolean {
    return clasz.status.toString() == 'BA' && clasz.teacher.user.status.toString() == 'HA' ;
  }

  canDisableClasz(clasz: Clasz): boolean {
    return clasz.status.toString() == 'HA';
  }
}
