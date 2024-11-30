import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { creationRoutineGuard } from './creation-routine.guard';

describe('creationRoutineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => creationRoutineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
