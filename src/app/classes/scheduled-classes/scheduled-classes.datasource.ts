import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClaszesService } from "../../services/classes/claszes.service";
import { Clasz } from "../../domain/clasz";
import { ScheduledClass } from "../../domain/class.scheduled";
import { LocalstorageService } from "../../services/auth/localstorage/localstorage.service";
import { ScheduledClassesService } from "../../services/scheduled-classes/scheduled-classes.service";
import { PaginatedObject } from "../../domain/paginated-object";

export class ScheduledClassesDataSource implements DataSource<ScheduledClass> {

    private scheduledClaszSubject = new BehaviorSubject<ScheduledClass[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private scheduledClassesService: ScheduledClassesService, private localStorageService: LocalstorageService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<ScheduledClass[]> {
        return this.scheduledClaszSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.scheduledClaszSubject.complete();
        this.loadingSubject.complete();
    }

    loadScheduledClaszes(sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        return this.scheduledClassesService.getScheduledClasses(pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar las clases programadas.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.scheduledClaszSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}