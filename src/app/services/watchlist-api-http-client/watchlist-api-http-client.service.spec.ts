import { TestBed, inject } from '@angular/core/testing';

import { WatchlistApiHttpClientService } from './watchlist-api-http-client.service';

describe('WatchlistApiHttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchlistApiHttpClientService]
    });
  });

  it('should be created', inject([WatchlistApiHttpClientService], (service: WatchlistApiHttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
