import { TestBed } from '@angular/core/testing';

import { SuscriptionPaymentService } from './suscription-payment.service';

describe('SuscriptionPaymentService', () => {
  let service: SuscriptionPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuscriptionPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
