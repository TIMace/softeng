import { TestBed, inject } from '@angular/core/testing';

import { UserDetailsService } from './user-details.service';

describe('UserDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDetailsService]
    });
  });

  it('should be created', inject([UserDetailsService], (service: UserDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
