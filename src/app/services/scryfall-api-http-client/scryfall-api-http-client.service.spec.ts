import { TestBed, inject } from '@angular/core/testing';

import { ScryfallApiHttpClientService } from './scryfall-api-http-client.service';

describe('ScryfallApiHttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScryfallApiHttpClientService]
    });
  });

  it('should be created', inject([ScryfallApiHttpClientService], (service: ScryfallApiHttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
