import { TestBed } from '@angular/core/testing';

import { ClaszesService } from './claszes.service';

describe('ClaszesService', () => {
  let service: ClaszesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaszesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
