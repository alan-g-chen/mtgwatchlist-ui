import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MtgCardListing } from '../../mtg-card-listing';

@Injectable({
  providedIn: 'root'
})
export class WatchlistApiHttpClientService {

  constructor(private httpClient: HttpClient) {
  }

  public GetWatchlistResults(accessToken: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();

    return this.httpClient.get<any>(environment.watchlistApiGetCardsUri, {
      headers,
      params
    });
  }

  public RemoveCardsFromWatchlist(accessToken: string, multiverseIds: number[]): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();
    var bodyObject = [];
    multiverseIds.forEach(element => {
      bodyObject.push({ MultiverseId: element });
    });

    var body = JSON.stringify(bodyObject);

    return this.httpClient.post<any>(environment.watchlistApiRemoveCardsUri, body, {
      headers,
      params
    });
  }

  public AddOrUpdateCardsToWatchList(accessToken: string, cards: MtgCardListing[]): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();
    var body = JSON.stringify(cards);

    return this.httpClient.post<any>(environment.watchlistApiUpdateCardsUri, body, {
      headers,
      params
    });
  }

}

