import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Routine } from "../../domain/routine";
import { RoutineService } from "../../services/routine/routine.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export class RoutineDataSource implements DataSource<Routine> {

    private routinesSubject = new BehaviorSubject<Routine[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private routineService: RoutineService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<Routine[]> {
        return this.routinesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.routinesSubject.complete();
        this.loadingSubject.complete();
    }

    loadRoutines(userId: number, sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.routineService.getRoutinesByUserId(userId, pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar las rutinas.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.routinesSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}