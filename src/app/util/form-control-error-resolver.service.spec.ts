import { TestBed } from '@angular/core/testing';

import { FormControlErrorResolverService } from './form-control-error-resolver.service';

describe('FormControlErrorResolverService', () => {
  let service: FormControlErrorResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormControlErrorResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
