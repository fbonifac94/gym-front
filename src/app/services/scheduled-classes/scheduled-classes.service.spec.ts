import { TestBed } from '@angular/core/testing';

import { ScheduledClassesService } from './scheduled-classes.service';

describe('ScheduledClassesService', () => {
  let service: ScheduledClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduledClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
