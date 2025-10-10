import { TestBed } from '@angular/core/testing';

import { MatchingServices } from './matching.services';

describe('MatchingServices', () => {
  let service: MatchingServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchingServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
