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
        console.log(data); // I have data! Let's return it so subscribers can use it!
        // we can do stuff with data if we want
        this.accessToken.next(data);
    }

}
