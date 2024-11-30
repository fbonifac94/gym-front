import { TestBed } from '@angular/core/testing';

import { ExerciseTypeService } from './exercise-type.service';

describe('ExerciseTypeService', () => {
  let service: ExerciseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
