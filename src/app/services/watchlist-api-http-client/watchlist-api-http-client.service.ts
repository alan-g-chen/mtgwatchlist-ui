import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  public AddNewCardToWatchList(accessToken: string, cardName: string, setName: string, currentPrice: number): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();

    var body = JSON.stringify({
      CardName: cardName,
      SetName: setName,
      CurrentPrice: currentPrice
    })

    return this.httpClient.post<any>(environment.watchlistApiAddCardUri, body, {
      headers,
      params
    });
  }

}

