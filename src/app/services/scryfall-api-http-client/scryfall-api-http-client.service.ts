import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ScryfallApiHttpClientService {

  constructor(private httpClient: HttpClient) { }

  public GetFuzzyCard(cardName: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json'
    });
    const params = new HttpParams();
    return this.httpClient.get<any>(environment.scryfallApiFuzzyFetchUrl + cardName, {
      headers,
      params
    });
  }

  public GetAllPrintingsOfCard(cardName: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json'
    });
    const params = new HttpParams();
    return this.httpClient.get<any>(environment.scryfallApiSearchUrl + cardName + "&unique=prints", {
      headers,
      params
    });
  }

  public GetMultiverseId(multiverseId: number): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      Accept: 'application/json'
    });
    const params = new HttpParams();
    return this.httpClient.get<any>(environment.scryfallApiMultiverseUrl + multiverseId, {
      headers,
      params
    });
  }

}
