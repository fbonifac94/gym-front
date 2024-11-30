import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { Admin } from "../../domain/admin";
import { AdminService } from "../../services/admin/admin.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export class AdminDataSource implements DataSource<Admin> {

    private adminSubject = new BehaviorSubject<Admin[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<Admin[]> {
        return this.adminSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.adminSubject.complete();
        this.loadingSubject.complete();
    }

    loadAdmins(documentFilter: string | null, sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.adminService.getAdmins(documentFilter, pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar los administradores.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.adminSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}