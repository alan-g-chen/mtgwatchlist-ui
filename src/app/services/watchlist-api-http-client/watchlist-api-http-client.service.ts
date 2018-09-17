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

  public RemoveCardsFromWatchlist(accessToken: string, multiverseIds: number[]): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();
    var bodyObject = [];
    multiverseIds.forEach(element => {
      bodyObject.push({MultiverseId: element});
    });
    
    var body = JSON.stringify(bodyObject);

    return this.httpClient.post<any>(environment.watchlistApiRemoveCardsUri, body, {
      headers,
      params
    });
  }

  public AddNewCardToWatchList(accessToken: string, cardName: string, setName: string, multiverseId: number, currentPrice: number): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'facebook-access-token': accessToken
    });

    const params = new HttpParams();
    var body = JSON.stringify([{
      CardName: cardName,
      SetName: setName,
      MultiverseId: multiverseId,
      CurrentPrice: currentPrice
    }]);

    return this.httpClient.post<any>(environment.watchlistApiUpdateCardsUri, body, {
      headers,
      params
    });
  }

}

