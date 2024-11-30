import { TestBed } from '@angular/core/testing';

import { ClassesInscriptionService } from './classes-inscription.service';

describe('ClassesInscriptionService', () => {
  let service: ClassesInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassesInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
