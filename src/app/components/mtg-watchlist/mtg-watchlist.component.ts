import { Component, OnInit } from '@angular/core';
import { TokenManagerService } from "../../services/token-manager/token-manager.service"

@Component({
  selector: 'app-mtg-watchlist',
  templateUrl: './mtg-watchlist.component.html',
  styleUrls: ['./mtg-watchlist.component.css']
})
export class MtgWatchlistComponent implements OnInit {

  private accessToken : string;
  constructor( private tokenManagerService : TokenManagerService) { }

  ngOnInit() {
      this.accessToken = null;
      this.tokenManagerService.myAccessToken$.subscribe((accessToken) => {
        this.accessToken = accessToken;
      }
    );
  }

  public isAuthenticated() : boolean {
    return (null != this.accessToken);
  }

}
