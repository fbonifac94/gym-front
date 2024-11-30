import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isCustomerGuard } from './is-customer.guard';

describe('isCustomerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isCustomerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
