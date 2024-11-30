import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Customer } from "../../domain/customer";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { CustomersService } from "../../services/customers/customers.service";
import { UserStatus } from "../../domain/enum/user-status";
import { MatSnackBar } from "@angular/material/snack-bar";

export class CustomerDataSource implements DataSource<Customer> {

    private customerSubject = new BehaviorSubject<Customer[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private customerService: CustomersService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<Customer[]> {
        return this.customerSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.customerSubject.complete();
        this.loadingSubject.complete();
    }

    loadCustomers(documentFilter: string | null, status: UserStatus | null, sortProperty: string, sortDirection: string, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.customerService.getCustomers(documentFilter, status, pageNumber, pageSize, sortProperty, sortDirection).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar los clientes.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.customerSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}