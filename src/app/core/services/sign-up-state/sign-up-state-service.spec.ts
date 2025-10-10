import { TestBed } from '@angular/core/testing';

import { SignUpStateService } from './sign-up-state-service';

describe('SignUpStateService', () => {
  let service: SignUpStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
