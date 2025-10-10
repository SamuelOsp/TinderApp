import { TestBed } from '@angular/core/testing';

import { ChatsServices } from './chats.services';

describe('ChatsServices', () => {
  let service: ChatsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
