import { TestBed, inject } from '@angular/core/testing';

import { TokenManagerService } from './token-manager.service';

describe('TokenManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenManagerService]
    });
  });

  it('should be created', inject([TokenManagerService], (service: TokenManagerService) => {
    expect(service).toBeTruthy();
  }));
});
