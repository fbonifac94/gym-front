import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Customer } from "../../domain/customer";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Teacher } from "../../domain/teacher";
import { TeacherService } from "../../services/teachers/teachers.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export class TeacherDataSource implements DataSource<Teacher> {

    private teacherSubject = new BehaviorSubject<Teacher[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private teacherService: TeacherService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<Customer[]> {
        return this.teacherSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.teacherSubject.complete();
        this.loadingSubject.complete();
    }

    loadTeachers(documentFilter: string | null, sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.teacherService.getTeachers(documentFilter, pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar los profesores.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.teacherSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}