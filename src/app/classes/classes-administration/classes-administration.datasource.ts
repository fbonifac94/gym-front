import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClaszesService } from "../../services/classes/claszes.service";
import { Clasz } from "../../domain/clasz";

export class ClaszDataSource implements DataSource<Clasz> {

    private claszSubject = new BehaviorSubject<Clasz[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private claszesService: ClaszesService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<Clasz[]> {
        return this.claszSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.claszSubject.complete();
        this.loadingSubject.complete();
    }

    loadClaszes(sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.claszesService.getClaszes(pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar las clases.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                response.list.map(elem => {
                    const initDate = new Date();
                    const initTime = elem.initSchedule.time.toString().split(',');
                    initDate.setHours(Number(initTime[0]))
                    initDate.setMinutes(Number(initTime[1]));
                    elem.initSchedule.time = initDate;

                    const endDate = new Date();
                    const endTime = elem.endSchedule.time.toString().split(',');
                    endDate.setHours(Number(endTime[0]))
                    endDate.setMinutes(Number(endTime[1]));

                    elem.endSchedule.time = endDate;

                    return elem;
                });
                this.claszSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}