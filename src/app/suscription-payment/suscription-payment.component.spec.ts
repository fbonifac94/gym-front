import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscriptionPaymentComponent } from './suscription-payment.component';

describe('SuscriptionPaymentComponent', () => {
  let component: SuscriptionPaymentComponent;
  let fixture: ComponentFixture<SuscriptionPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuscriptionPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuscriptionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
