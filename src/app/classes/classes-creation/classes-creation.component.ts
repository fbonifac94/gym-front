import { AsyncPipe, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Day } from '../../domain/day';
import { Schedule } from '../../domain/schedule';
import { Teacher } from '../../domain/teacher';
import { ClaszesService } from '../../services/classes/claszes.service';
import { DayService } from '../../services/day/day.service';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { Observable } from 'rxjs';
import { Clasz } from '../../domain/clasz';
import { TeacherService } from '../../services/teachers/teachers.service';
import { UserStatus } from '../../domain/enum/user-status';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassCreationRequest } from '../../domain/request/class.creation.reques';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControlErrorResolverService } from '../../util/form-control-error-resolver.service';
import { UpdateClaszRequest } from '../../domain/request/class.edit.request';

@Component({
  selector: 'app-classes-creation',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatFormField, MatSelectModule, MatOptionModule, MatDialogModule, DatePipe, MatLabel, MatButtonModule, NgFor, AsyncPipe, FormsModule,
    MatDialogContent, MatError, MatDialogActions, MatInputModule, MatProgressSpinnerModule, TitleCasePipe, NgIf],
  templateUrl: './classes-creation.component.html',
  styleUrl: './classes-creation.component.css'
})
export class ClassesCreationComponent implements OnInit {

  classForm!: FormGroup;

  nameFormControl!: FormControl;
  dayFormControl!: FormControl;
  initScheduleFormControl!: FormControl;
  endScheduleFormControl!: FormControl;
  teacherFormControl!: FormControl;
  capacityFormControl!: FormControl;

  days$: Observable<Day[]>;
  initSchedules$: Observable<Schedule[]>;
  endSchedules$: Observable<Schedule[]>;
  teachers$: Observable<Teacher[]>;
  isEditMode: boolean;

  constructor(private claszesService: ClaszesService, private dayService: DayService, private teacherService: TeacherService,
    private scheduleService: ScheduleService, private dialogRef: MatDialogRef<ClassesCreationComponent>, @Inject(MAT_DIALOG_DATA) public data: { clasz: Clasz },
    private snackBar: MatSnackBar, private formControlErrorResolver: FormControlErrorResolverService) {

    this.days$ = this.dayService.getDays();
    this.endSchedules$ = this.initSchedules$ = this.scheduleService.getSchedules();
    this.teachers$ = this.teacherService.getTeachersByStatus(UserStatus.HA);

    this.isEditMode = (data) ? true : false;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.nameFormControl = new FormControl(this.data?.clasz.name || '', [Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]);
    this.dayFormControl = new FormControl(this.data?.clasz.day || '', Validators.required);
    this.initScheduleFormControl = new FormControl(this.data?.clasz.initSchedule || '', Validators.required);
    this.endScheduleFormControl = new FormControl(this.data?.clasz.endSchedule || '', Validators.required);
    this.teacherFormControl = new FormControl(this.data?.clasz.teacher || '', Validators.required);
    this.capacityFormControl = new FormControl(this.data?.clasz.classPersonsAmount || '', [Validators.required, Validators.min(1)]);

    if (this.isEditMode) {
      this.nameFormControl.disable();
    }

    this.initScheduleFormControl.valueChanges.subscribe({
      next: () => this.classForm.updateValueAndValidity()
    });

    this.endScheduleFormControl.valueChanges.subscribe({
      next: () => this.classForm.updateValueAndValidity()
    });

    this.classForm = new FormGroup({
      name: this.nameFormControl,
      day: this.dayFormControl,
      initSchedule: this.initScheduleFormControl,
      endSchedule: this.endScheduleFormControl,
      teacher: this.teacherFormControl,
      capacity: this.capacityFormControl
    }, { validators: this.scheduleValidator('initSchedule', 'endSchedule') });
  }

  scheduleValidator(initKey: string, endKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const initSchedule = this.initScheduleFormControl.value;
      const endSchedule = this.endScheduleFormControl.value;

      if (initSchedule && endSchedule && initSchedule.time > endSchedule.time) {
        this.endScheduleFormControl.setErrors({ invalidSchedule: true });
        return { invalidSchedule: true };
      } 
        this.endScheduleFormControl.setErrors(null);
        return null;
      
    };
  }

  disableSave() {
    if (this.classForm.invalid) {
      return true;
    } else {
      if (!this.isEditMode) {
        return false;
      } else {
        return this.data.clasz.day.id == this.dayFormControl.value.id &&
          this.data.clasz.initSchedule.id == this.initScheduleFormControl.value.id &&
          this.data.clasz.endSchedule.id == this.endScheduleFormControl.value.id &&
          this.data.clasz.teacher.id == this.teacherFormControl.value.id &&
          this.data.clasz.classPersonsAmount == this.capacityFormControl.value;
      }
    }
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      if (this.isEditMode) {
        this.editClass();
      } else {
        this.createClass();
      }
    }
  }

  createClass() {
    const request: ClassCreationRequest = {
      name: this.nameFormControl.value,
      dayId: this.dayFormControl.value.id,
      initScheduleId: this.initScheduleFormControl.value.id,
      endScheduleId: this.endScheduleFormControl.value.id,
      teacherId: this.teacherFormControl.value.id,
      amountPerClass: this.capacityFormControl.value
    };

    this.claszesService.createClass(request).subscribe({
      next: () => {
        this.snackBar.open('Se creó la clase correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        this.dialogRef.close(true);
      },
      error: errorResponse => {
        if (errorResponse.error && errorResponse.error.code === 102) {
          this.snackBar.open(errorResponse.error.errorMessage, '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        } else {
          this.snackBar.open('Ocurrió un error al intentar crear la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }
      }
    })
  }

  editClass() {
    const request: UpdateClaszRequest = {
      dayId: this.dayFormControl.value.id,
      initScheduleId: this.initScheduleFormControl.value.id,
      endScheduleId: this.endScheduleFormControl.value.id,
      teacherId: this.teacherFormControl.value.id,
      amountPerClass: this.capacityFormControl.value
    };

    this.claszesService.updateClass(this.data.clasz.id, request).subscribe({
      next: () => {
        this.snackBar.open('Se actualizó la clase correctamente.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        this.dialogRef.close(true);
      },
      error: errorResponse => {
        if (errorResponse.error && errorResponse.error.code === 102) {
          this.snackBar.open(errorResponse.error.errorMessage, '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        } else {
          this.snackBar.open('Ocurrió un error al intentar guardar los cambios de la clase.', '', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }
      }
    })
  }

  compareDays(day1: Day, day2: Day): boolean {
    return day1 && day2 && day1.id === day2.id;
  }

  compareSchedules(schedule1: Schedule, schedule2: Schedule): boolean {
    return schedule1 && schedule2 && schedule1.id === schedule2.id;
  }

  compareTeachers(teacher1: Teacher, teacher2: Teacher): boolean {
    return teacher1 && teacher2 && teacher1.id === teacher2.id;
  }

  getErrorMessage(formControlName: string) {
    return this.formControlErrorResolver.getErrorMessage(this.classForm, 'classForm:' + formControlName);
  }


}
