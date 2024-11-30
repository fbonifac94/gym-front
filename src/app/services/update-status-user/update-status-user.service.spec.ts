import { TestBed } from '@angular/core/testing';

import { UpdateUserStatusService } from './update-status-user.service';

describe('UpdateStatusUserService', () => {
  let service: UpdateUserStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateUserStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
