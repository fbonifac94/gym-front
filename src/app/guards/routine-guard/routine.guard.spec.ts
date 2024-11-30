import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routineGuard } from './routine.guard';

describe('routineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
