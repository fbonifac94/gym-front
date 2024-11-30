import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isFirstLoginGuard } from './is-first-login.guard';

describe('isFirstLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isFirstLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
