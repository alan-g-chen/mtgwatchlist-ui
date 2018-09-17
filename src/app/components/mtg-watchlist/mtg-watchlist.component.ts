import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenManagerService } from "../../services/token-manager/token-manager.service"
import { MtgCardListing } from "../../mtg-card-listing"
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { WatchlistApiHttpClientService } from '../../services/watchlist-api-http-client/watchlist-api-http-client.service'
import { ScryfallApiHttpClientService } from '../../services/scryfall-api-http-client/scryfall-api-http-client.service'

import { ButtonOpts } from 'mat-progress-buttons'
import { GathererDialogComponent } from '../gatherer-dialog/gatherer-dialog.component';
import { environment } from '../../../environments/environment.prod';

const LOADING_CARD: CardInformation = {
  cardName: "Loading cards...",
  setName: "Loading sets...",
  cardPrice: null,
  multiverseId: null,
  isFoil: false,
  canBeFoil: false
}

export interface CardInformation {
  cardName: string;
  setName: string;
  cardPrice: number;
  multiverseId: number;
  isFoil: boolean;
  canBeFoil: boolean;
}

@Component({
  selector: 'app-mtg-watchlist',
  templateUrl: './mtg-watchlist.component.html',
  styleUrls: ['./mtg-watchlist.component.css']
})
export class MtgWatchlistComponent implements OnInit {

  private accessToken: string;

  public cardOptions: CardInformation[] = [];
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
  public emptyCard: CardInformation = {
    cardName: "",
    setName: "",
    cardPrice: null,
    multiverseId: null,
    isFoil: false,
    canBeFoil: false
  }
  public loadedWatchlistDataSource = new MatTableDataSource([]);
  public displayedColumns: string[] = ['cardName', 'setName', 'startingPrice', 'lastPrice', 'currentPrice', 'Button'];
  public newCard: CardInformation = this.emptyCard;
  public priceLoading: boolean = false;
  public currentlyLoadedCardName: string;
  public isDevelopment: boolean = !environment.production;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tokenManagerService: TokenManagerService,
    private watchlistApiService: WatchlistApiHttpClientService,
    private scryService: ScryfallApiHttpClientService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadedWatchlistDataSource.sort = this.sort;
    this.accessToken = null;
    this.tokenManagerService.myAccessToken$.subscribe((accessToken) => {
      this.accessToken = accessToken;
    }
    );
  }

  public isAuthenticated(): boolean {
    return (null != this.accessToken);
  }

  public openViewCardDialog(multiverseId: number): void {
    let isMobile = /Android|iPhone/i.test(window.navigator.userAgent)
    const dialogRef = this.dialog.open(GathererDialogComponent, {
      width: 'flex',
      data: { multiverseId: multiverseId, isMobile: isMobile }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  public updateNewCardPriceFromApi(): void {
    if (null != this.newCard && null != this.newCard.multiverseId) {
      this.priceLoading = true;
      this.newCard.cardPrice = null;
      this.scryService
        .GetMultiverseId(this.newCard.multiverseId)
        .subscribe(
          response => {
            var responseObject = JSON.parse(JSON.stringify(response));
            this.newCard.cardPrice = responseObject.usd;
            this.priceLoading = false;
          },
          (error: HttpResponse<any>) => {
            console.error(error);
            this.priceLoading = false;
          });
    }
  }

  public fetchCardSetsFromApi(): void {
    if (this.currentlyLoadedCardName == this.newCard.cardName) {
      // I'm already loaded from last time. Don't change anything.
      return;
    }
    this.cardOptions = []; // clear the cards options.
    if (null != this.newCard.cardName && "" != this.newCard.cardName) {
      this.cardOptions = [LOADING_CARD]; // show a loading card.
      var tempCardName = this.newCard.cardName;
      if (!tempCardName.includes(' ')) { tempCardName = "!" + tempCardName } // Appending an ! here for exact text search if it's a single word.
      this.scryService
        .GetAllPrintingsOfCard(tempCardName)
        .subscribe(
          res => {
            this.cardOptions = [];
            var resultingObject = JSON.parse(JSON.stringify(res)).data;
            resultingObject.forEach(element => {
              if (element.multiverse_ids.length >= 1) { // TODO: We're only going to fetch cards with multiverse IDs.
                var newCard: CardInformation = {
                  cardName: element.name,
                  setName: element.set_name,
                  cardPrice: 0,
                  multiverseId: element.multiverse_ids[0],
                  canBeFoil: element.foil, // TODO: there are some cards that can only be foil. Let's figure out how to address those.
                  isFoil: !(element.nonfoil) // For now, we'll just default to foil if the nonfoil is not available.
                }
                this.cardOptions.push(newCard);
                this.currentlyLoadedCardName = newCard.cardName;
              }
            });
          },
          (error: HttpResponse<any>) => {
            this.cardOptions = [];
            this.currentlyLoadedCardName = this.newCard.cardName;
            console.error(error);
          });
    }
  }

  public getWatchlistItemsFromApi(): void {
    this.fetchCardsButtonOptions.active = true;
    this.fetchCardsButtonOptions.buttonColor = 'primary';

    this.watchlistApiService
      .GetWatchlistResults(this.accessToken)
      .subscribe(
        res => {
          var listingResponse: MtgCardListing[] = <MtgCardListing[]>JSON.parse(JSON.stringify(res));
          this.loadedWatchlistDataSource.data = listingResponse;
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

  public addNewCardToWatchlistApi(): void {

    if (this.newCard.multiverseId == null || this.newCard.cardName == null || this.newCard.cardPrice == null || this.newCard.setName == null) {
      console.error("Null values detected.");
      this.addCardButtonOptions.buttonColor = 'warn';
    }
    else {
      this.addCardButtonOptions.active = true;
      this.addCardButtonOptions.buttonColor = 'primary';
      this.watchlistApiService
        .AddNewCardToWatchList(this.accessToken, this.newCard.cardName, this.newCard.setName, this.newCard.multiverseId, this.newCard.cardPrice)
        .subscribe(
          res => {
            this.addCardButtonOptions.active = false;

            var pushedCard: MtgCardListing = new MtgCardListing();
            pushedCard.cardName = this.newCard.cardName;
            pushedCard.setName = this.newCard.setName;
            pushedCard.multiverseId = this.newCard.multiverseId;
            pushedCard.startingPrice = this.newCard.cardPrice;
            pushedCard.lastSeenPrice = this.newCard.cardPrice;
            pushedCard.currentPrice = this.newCard.cardPrice;

            this.removeMultiverseIdFromDataTableIfExists(pushedCard.multiverseId);

            var tempArray = this.loadedWatchlistDataSource.data;
            tempArray.push(pushedCard);
            this.loadedWatchlistDataSource.data = tempArray;

            this.newCard = this.emptyCard;
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

  public removeCardFromWatchlistApi(multiverseId: number): void {
    if (multiverseId == null || multiverseId <= 0) {
      // Something went wrong - this shouldn't have happened.
      console.error("A null or invalid objetc was passed to the remove functionm MultiverseId passed:" + multiverseId);
      return;
    }

    this.watchlistApiService.RemoveCardsFromWatchlist(this.accessToken, [multiverseId])
      .subscribe(
        response => {
          this.removeMultiverseIdFromDataTableIfExists(multiverseId);
        },
        (error: HttpResponse<any>) => {
          console.error(error)
        });
  }

  private removeMultiverseIdFromDataTableIfExists(multiverseId: number): void {
    var indexOfExistingCard = this.loadedWatchlistDataSource.data.findIndex(x => x.multiverseId == multiverseId);
    console.log(indexOfExistingCard);
    if (indexOfExistingCard >= 0) {
      var tempArray = this.loadedWatchlistDataSource.data;
      tempArray.splice(indexOfExistingCard, 1);
      this.loadedWatchlistDataSource.data = tempArray;
    }
  }

  applyTableFilter(filterValue: string) {
    this.loadedWatchlistDataSource.filter = filterValue.trim().toLowerCase();
  }
}

