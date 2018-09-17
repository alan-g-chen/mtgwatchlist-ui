import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {

  myAccessToken$: Observable<string>;
    private accessToken = new Subject<string>();

    constructor() {
        this.myAccessToken$ = this.accessToken.asObservable();
    }

    myAccessToken(data) {
        this.accessToken.next(data);
    }

}
