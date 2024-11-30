import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClassesInscriptionService } from '../../services/classes-inscription/classes-inscription.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { BehaviorSubject, finalize, map, } from 'rxjs';
import { Customer } from '../../domain/customer';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-classes-inscriptions',
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule, MatListModule, NgIf, AsyncPipe, NgFor, MatButtonModule, TitleCasePipe, MatIconModule],
  templateUrl: './classes-inscriptions.component.html',
  styleUrl: './classes-inscriptions.component.css'
})
export class ClassesInscriptionsComponent {

  className: string;

  isLoading = false;

  customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  constructor(private classesInscriptionService: ClassesInscriptionService, private dialogRef: MatDialogRef<ClassesInscriptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { scheduledClaszName: string, scheduledClaszId: number }) {
    this.className = data.scheduledClaszName;
    this.isLoading = true;
    this.classesInscriptionService.getInscriptionsByScheduledClassId(this.data.scheduledClaszId)
      .pipe(finalize(() => this.isLoading = false),
        map(inscriptions => inscriptions.map(inscription => inscription.customer)))
      .subscribe({
        next: data => this.customersSubject.next(data),
        error: () => { this.customersSubject.next([]) }
      });
  }

  ngOnInit(): void {

  }

  haveContent(customers: Customer[] | null) {
    return customers !== null && customers.length > 0;
  }

  close(): void {
    this.dialogRef.close();
  }

  getAmountOfPersonsInscripted(customers: Customer[] | null) {
    return (customers) ? customers.length : 0;
  }
}
