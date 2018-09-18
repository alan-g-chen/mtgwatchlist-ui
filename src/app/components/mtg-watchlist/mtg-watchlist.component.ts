import { HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenManagerService } from "../../services/token-manager/token-manager.service"
import { MtgCardListing } from "../../mtg-card-listing"
import { MatTableDataSource, MatSort, MatDialog, MatProgressBar } from '@angular/material';
import { WatchlistApiHttpClientService } from '../../services/watchlist-api-http-client/watchlist-api-http-client.service'
import { ScryfallApiHttpClientService } from '../../services/scryfall-api-http-client/scryfall-api-http-client.service'

import { ButtonOpts } from 'mat-progress-buttons'
import { GathererDialogComponent } from '../gatherer-dialog/gatherer-dialog.component';
import { environment } from '../../../environments/environment';

const LOADING_CARD: MtgCardListing = {
  cardName: "Loading cards...",
  setName: "Loading sets...",
  currentPrice: null,
  startingPrice: null,
  lastSeenPrice: null,
  multiverseId: null,
  isFoil: false,
  canBeFoil: false,
  isUpdating: false
}

@Component({
  selector: 'app-mtg-watchlist',
  templateUrl: './mtg-watchlist.component.html',
  styleUrls: ['./mtg-watchlist.component.css']
})
export class MtgWatchlistComponent implements OnInit {

  private accessToken: string;
  public pricePlaceholderValue: string = "Current Price";
  public cardOptions: MtgCardListing[] = [];
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
  public updateCardPricesButtonOptions: ButtonOpts = {
    active: false,
    text: 'Update card prices!',
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
  public emptyCard: MtgCardListing = {
    cardName: "",
    setName: "",
    currentPrice: null,
    lastSeenPrice: null,
    startingPrice: null,
    multiverseId: null,
    isFoil: false,
    canBeFoil: false,
    isUpdating: false
  }
  public loadedWatchlistDataSource = new MatTableDataSource([]);
  public displayedColumns: string[] = ['cardName', 'setName', 'startingPrice', 'lastPrice', 'currentPrice', 'isUpdating', 'actions'];
  public newCard: MtgCardListing = this.emptyCard;
  public priceLoading: boolean = false;
  public currentlyLoadedCardName: string;
  public isDevelopment: boolean = !environment.production;
  public possibleCardNames: string[] = [];

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
    const dialogRef = this.dialog.open(GathererDialogComponent, {
      width: 'flex',
      data: { multiverseId: multiverseId }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  public updateNewCardPriceFromApi(): void {
    if (null != this.newCard && null != this.newCard.multiverseId) {
      this.pricePlaceholderValue = "Loading price..."
      this.newCard.currentPrice = null;
      this.scryService
        .GetMultiverseId(this.newCard.multiverseId)
        .subscribe(
          response => {
            console.log(response)
            var responseObject = JSON.parse(JSON.stringify(response));
            if (responseObject.usd != null && responseObject.usd != undefined) {
              this.newCard.currentPrice = responseObject.usd;
              this.pricePlaceholderValue = "Current Price";
            }
            else {
              this.pricePlaceholderValue = "Price was not found!.";
            }
          },
          (error: HttpResponse<any>) => {
            console.error(error);
            this.pricePlaceholderValue = "Price lookup failed!";
          });
    }
  }

  public typingCardName(cardHint: string): void {
    this.newCard = this.emptyCard;
    this.cardOptions = [];
    this.pricePlaceholderValue = "Current Price";
    if (null != cardHint && cardHint.length >= 3) {
      this.scryService
        .GetAutoCompleteSuggestions(cardHint)
        .subscribe(
          response => {
            var responseObject = JSON.parse(JSON.stringify(response));
            this.possibleCardNames = responseObject.data;
          },
          (error: HttpResponse<any>) => {
            console.error(error);
          });
    }
    else {
      this.possibleCardNames = [];
    }
  }

  public updateAllCardPricesFromApi(): void {
    // set the button to loading
    this.updateCardPricesButtonOptions.active = true;

    // get current card list
    var updatedMtgCardArray: MtgCardListing[] = this.loadedWatchlistDataSource.data;

    // trigger loading animation for the cards;
    updatedMtgCardArray.map(function (element) {
      element.isUpdating = true;
      return element;
    });

    // update prices
    updatedMtgCardArray.map(function (element) {
      element.isUpdating = false;
      this.scryService.GetMultiverseId(element.multiverseId)
        .subscribe(
          response => {
            var responseObject = JSON.parse(JSON.stringify(response));
            this.newCard.cardPrice = responseObject.usd;
            element.lastSeenPrice = element.currentPrice;
            element.currentPrice = responseObject.usd;
            return element;
          },
          (error: HttpResponse<any>) => {
            console.error("Updating" + element.multiverseId + ":" + error);
            return element;
          });
    }, this);

    // Update our API
    this.watchlistApiService.AddOrUpdateCardsToWatchList(this.accessToken, updatedMtgCardArray)
      .subscribe(
        response => {
          //don't need to do anything
        },
        (error: HttpResponse<any>) => {
          console.log(error);
        });
    // update dataview
    this.loadedWatchlistDataSource.data = updatedMtgCardArray;
    this.updateCardPricesButtonOptions.active = false;
  }

  public fetchCardSetsFromApi(): void {
    console.debug("Entering fetchCardSetsFromApi()");
    if (this.currentlyLoadedCardName != "" && this.currentlyLoadedCardName == this.newCard.cardName) {
      // I'm already loaded from last time, and I'm not a new thing. Don't change anything.
      console.debug("The card named " + this.currentlyLoadedCardName + " was already loaded, so not fetching sets.");
    }
    else if (null == this.newCard.cardName || this.newCard.cardName == "") {
      // The card name is null or empty, so don't bother fetching.
      console.debug("There's no current card name, so not fetching sets.");
      this.cardOptions = []; // clear the card options.      
    }
    else {
      console.debug("Loading sets for card named " + this.newCard.cardName);
      this.cardOptions = [LOADING_CARD]; // show a loading card.
      var tempCardName = this.newCard.cardName;
      if (!tempCardName.includes(' ')) { tempCardName = "!" + tempCardName } // Appending an ! here for exact text search if it's a single word.
      console.debug("Calling api for value: " + tempCardName);
      this.scryService
        .GetAllPrintingsOfCard(tempCardName)
        .subscribe(
          res => {
            console.debug("Got result!");
            this.cardOptions = [];
            var resultingObject = JSON.parse(JSON.stringify(res)).data;
            resultingObject.forEach(element => {
              if (element.multiverse_ids.length >= 1) { // TODO: We're only going to fetch cards with multiverse IDs.
                var newCard: MtgCardListing = {
                  cardName: element.name,
                  setName: element.set_name,
                  currentPrice: 0,
                  lastSeenPrice: 0,
                  startingPrice: 0,
                  multiverseId: element.multiverse_ids[0],
                  canBeFoil: element.foil, // TODO: there are some cards that can only be foil. Let's figure out how to address those.
                  isFoil: !(element.nonfoil), // For now, we'll just default to foil if the nonfoil is not available.
                  isUpdating: false
                }
                this.cardOptions.push(newCard);
                this.currentlyLoadedCardName = newCard.cardName;
              }
            });
          },
          (error: HttpResponse<any>) => {
            if (error.status == 404) {
              this.newCard.setName = "No sets found!"
              this.cardOptions = [this.newCard];
            }
            else {
              console.error(error);
              this.cardOptions = [];
            }
            this.currentlyLoadedCardName = this.newCard.cardName;
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

    if (this.newCard.multiverseId == null || this.newCard.cardName == null || this.newCard.currentPrice == null || this.newCard.setName == null) {
      console.error("Null values detected.");
      this.addCardButtonOptions.buttonColor = 'warn';
    }
    else {
      this.addCardButtonOptions.active = true;
      this.addCardButtonOptions.buttonColor = 'primary';
      this.watchlistApiService
        .AddOrUpdateCardsToWatchList(this.accessToken, [this.newCard])
        .subscribe(
          res => {
            this.addCardButtonOptions.active = false;

            this.removeMultiverseIdFromDataTableIfExists(this.newCard.multiverseId);

            var tempArray = this.loadedWatchlistDataSource.data;
            tempArray.push(this.newCard);
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
      console.error("A null or invalid object was passed to the remove function. MultiverseId passed:" + multiverseId);
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

