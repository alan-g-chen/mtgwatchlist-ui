import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenManagerService } from "../../services/token-manager/token-manager.service"
import { MtgCardListing } from "../../mtg-card-listing"
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { WatchlistApiHttpClientService } from '../../services/watchlist-api-http-client/watchlist-api-http-client.service'
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ButtonOpts } from 'mat-progress-buttons'
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-mtg-watchlist',
  templateUrl: './mtg-watchlist.component.html',
  styleUrls: ['./mtg-watchlist.component.css']
})
export class MtgWatchlistComponent implements OnInit {

  private accessToken: string;

  public fetchCardsButtonOptions: ButtonOpts = {
    active: false,
    text: 'Fetch my watch list!',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  public addCardButtonOptions: ButtonOpts = {
    active: false,
    text: 'Add to my watch list!',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  public mtgCards = new MatTableDataSource([]);
  public displayedColumns: string[] = ['cardName', 'setName', 'lastPrice', 'currentPrice', 'Button'];
  public newCard = {
    cardName: null,
    setName: null,
    cardPrice: null
  }

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tokenManagerService: TokenManagerService,
    private apiService: WatchlistApiHttpClientService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.mtgCards.sort = this.sort;
    this.accessToken = null;
    this.tokenManagerService.myAccessToken$.subscribe((accessToken) => {
      this.accessToken = accessToken;
    }
    );
  }

  public isAuthenticated(): boolean {
    return (null != this.accessToken);
  }

  public getItemsFromApi(): void {
    this.fetchCardsButtonOptions.active = true;
    this.fetchCardsButtonOptions.buttonColor = 'primary';

    this.apiService
      .GetWatchlistResults(this.accessToken)
      .subscribe(
        res => {
          console.log(res);
          var listingResponse: MtgCardListing[] = <MtgCardListing[]>JSON.parse(JSON.stringify(res));
          this.mtgCards.data = listingResponse;
          this.fetchCardsButtonOptions.active = false;
        },
        (error: HttpResponse<any>) => {
          console.error(error);
          this.fetchCardsButtonOptions.buttonColor = 'error';
          this.fetchCardsButtonOptions.active = false;

          // this.dialog.open(ErrorDialogComponent, {
          //   width: '250px',
          //   data: { error: error }
          // });
        });
  }

  public addNewCardToApi(): void {
    
    if (this.newCard.cardName == null || this.newCard.cardPrice == null || this.newCard.setName == null)
    {
      console.error("Null values detected.");
      this.addCardButtonOptions.buttonColor = 'warn';
    }
    else
    {
      this.addCardButtonOptions.active = true;
      this.addCardButtonOptions.buttonColor = 'primary';
      this.apiService
        .AddNewCardToWatchList(this.accessToken, this.newCard.cardName, this.newCard.setName, this.newCard.cardPrice)
        .subscribe(
          res => {
            this.addCardButtonOptions.active = false;
            
            var pushedCard : MtgCardListing = new MtgCardListing();
            pushedCard.cardName = this.newCard.cardName;
            pushedCard.setName = this.newCard.setName;
            pushedCard.lastPrice = null;
            pushedCard.currentPrice = this.newCard.cardPrice;

            var tempArray = this.mtgCards.data;
            var indexOfExistingCard = tempArray.findIndex( x => x.cardName == pushedCard.cardName && x.setName == pushedCard.setName);

            tempArray.splice(indexOfExistingCard, 1);            
            tempArray.push(pushedCard);           

            this.mtgCards.data = tempArray;           

            this.newCard = {
              cardName: null,
              setName: null,
              cardPrice: null
            }
          },
          (error: HttpResponse<any>) => {
            console.error(error);
            this.addCardButtonOptions.buttonColor = 'warn';
            this.addCardButtonOptions.active = false;
            // this.dialog.open(ErrorDialogComponent, {
            //   width: '250px',
            //   data: { error: error }
            // });
          });
    }
  }
}

