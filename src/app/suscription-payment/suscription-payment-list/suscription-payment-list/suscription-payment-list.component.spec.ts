import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscriptionPaymentListComponent } from './suscription-payment-list.component';

describe('SuscriptionPaymentListComponent', () => {
  let component: SuscriptionPaymentListComponent;
  let fixture: ComponentFixture<SuscriptionPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuscriptionPaymentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuscriptionPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
