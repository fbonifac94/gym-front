import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SuscriptionPayment } from "../../../domain/suscription.payment";
import { SuscriptionPaymentService } from "../../../services/suscription-payment/suscription-payment.service";

export class SuscriptionPaymentListDataSource implements DataSource<SuscriptionPayment> {

    private suscriptionPaymentSubject = new BehaviorSubject<SuscriptionPayment[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public totalElements = 0;
    public isLoading$ = this.loadingSubject.asObservable();

    constructor(private suscriptionPaymentService: SuscriptionPaymentService, private snackBar: MatSnackBar) { }

    connect(collectionViewer: CollectionViewer): Observable<SuscriptionPayment[]> {
        return this.suscriptionPaymentSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.suscriptionPaymentSubject.complete();
        this.loadingSubject.complete();
    }

    loadSuscriptionPayment(documentNumber: string | null, startDate: string | null, endDate: string | null, pageNumber: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.suscriptionPaymentService.getSuscriptionPayments(documentNumber, startDate, endDate,  pageNumber, pageSize).pipe(
            catchError(error => {
                this.snackBar.open('Ocurrió un error al cargar los pagos.', '', {
                    duration: 3000,
                });
                return of({ list: [], totalElements: 0 });
            }),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(response => {
                this.suscriptionPaymentSubject.next(response.list);
                this.totalElements = response.totalElements;
            });
    }
}