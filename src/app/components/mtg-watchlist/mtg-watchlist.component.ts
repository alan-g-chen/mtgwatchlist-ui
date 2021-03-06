import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenManagerService } from "../../services/token-manager/token-manager.service"
import { MtgCardListing } from "../../mtg-card-listing"
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { WatchlistApiHttpClientService } from '../../services/watchlist-api-http-client/watchlist-api-http-client.service'
import { ScryfallApiHttpClientService } from '../../services/scryfall-api-http-client/scryfall-api-http-client.service'

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MatProgressButtonOptions } from 'mat-progress-buttons'
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
  private ngUnsubscribe = new Subject();
  private isFirstLoad: boolean = true;

  public pricePlaceholderValue: string = "Current Price";
  public cardOptions: MtgCardListing[] = [];
  public fetchCardsButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Fetch my watch list!',
    buttonColor: 'black',
    barColor: 'primary',
    raised: true,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  public updateCardPricesButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Update card prices!',
    buttonColor: 'black',
    barColor: 'primary',
    raised: true,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  public addCardButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Add to my watch list!',
    buttonColor: 'black',
    barColor: 'primary',
    raised: true,
    mode: 'indeterminate',
    value: 0,
    disabled: true
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
  public loadedWatchlistDataSource = new MatTableDataSource<MtgCardListing>([]);
  public displayedColumns: string[] = ['cardName', 'setName', 'startingPrice', 'lastPrice', 'currentPrice', 'profit', 'actions'];
  public newCard: MtgCardListing = this.emptyCard;
  public currentlyLoadedCardName: string;
  public isDevelopment: boolean = !environment.production;
  public possibleCardNames: string[] = [];
  public gridListColumnCount: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private tokenManagerService: TokenManagerService,
    private watchlistApiService: WatchlistApiHttpClientService,
    private scryService: ScryfallApiHttpClientService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.gridListColumnCount = (window.innerWidth <= 400) ? 1 : 2;
    this.accessToken = null;
    this.tokenManagerService.myAccessToken$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accessToken => this.accessToken = accessToken);
  }

  ngAfterViewInit() {
    this.loadedWatchlistDataSource.sort = this.sort;
    this.loadedWatchlistDataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onResize(): void {
    this.gridListColumnCount = (window.innerWidth <= 400) ? 1 : 2;
  }

  public isAuthenticated(): boolean {
    if (null != this.accessToken && this.isFirstLoad) {
      this.isFirstLoad = false;
      this.getWatchlistItemsFromApi();
    }
    return (null != this.accessToken);
  }

  public openViewCardDialog(multiverseId: number): void {
    const dialogRef = this.dialog.open(GathererDialogComponent, {
      height: 'flex',
      width: 'flex',
      data: { multiverseId: multiverseId }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => { });
  }

  public updateNewCardPriceFromApi(): void {
    if (null != this.newCard && null != this.newCard.multiverseId) {
      this.pricePlaceholderValue = "Loading price..."
      this.newCard.currentPrice = null;
      this.scryService
        .GetMultiverseId(this.newCard.multiverseId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          response => {
            var responseObject = JSON.parse(JSON.stringify(response));
            if (responseObject.usd != null && responseObject.usd != undefined) {
              this.newCard.currentPrice = responseObject.usd;
              this.pricePlaceholderValue = "Current Price";
              this.addCardButtonOptions.disabled = false;
              if (this.loadedWatchlistDataSource.data.findIndex(x => x.multiverseId == this.newCard.multiverseId) >= 0) {
                // card already exists, so update the button text
                this.addCardButtonOptions.text = "Update my watchlist!";
              }
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
    // Reinitialize everything
    this.reinitializeComponentValues();

    if (null != cardHint && cardHint.length >= 3) {
      this.scryService
        .GetAutoCompleteSuggestions(cardHint)
        .pipe(takeUntil(this.ngUnsubscribe))
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
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          response => {
            var responseObject = JSON.parse(JSON.stringify(response));
            this.newCard.cardPrice = responseObject.usd;
            element.lastSeenPrice = element.currentPrice;
            element.currentPrice = +responseObject.usd;

            // Update our API. TODO: Figure out a way to make an aggregated call.
            this.watchlistApiService.AddOrUpdateCardsToWatchList(this.accessToken, [element])
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                response => {
                  //don't need to do anything
                },
                (error: HttpResponse<any>) => {
                  console.error(error);
                });
            return element;
          },
          (error: HttpResponse<any>) => {
            console.error("Updating" + element.multiverseId + ":" + error);
            return element;
          });
    }, this);

    // update dataview
    this.updateTableDataSource(updatedMtgCardArray);
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
        .pipe(takeUntil(this.ngUnsubscribe))
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
    this.fetchCardsButtonOptions.buttonColor = 'black';

    this.watchlistApiService
      .GetWatchlistResults(this.accessToken)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          var listingResponse: MtgCardListing[] = <MtgCardListing[]>JSON.parse(JSON.stringify(res));
          this.updateTableDataSource(listingResponse);
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
      this.addCardButtonOptions.buttonColor = 'black';
      this.watchlistApiService
        .AddOrUpdateCardsToWatchList(this.accessToken, [this.newCard])
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.addCardButtonOptions.active = false;
            if (!this.removeMultiverseIdFromDataTableIfExists(this.newCard.multiverseId)) {
              this.newCard.lastSeenPrice = this.newCard.currentPrice;
              this.newCard.startingPrice = this.newCard.currentPrice;
            }
            var tempArray = this.loadedWatchlistDataSource.data;
            tempArray.push(this.newCard);
            this.updateTableDataSource(tempArray);
            this.reinitializeComponentValues();
            this.addCardButtonOptions.text = "Watchlist updated!"
          },
          (error: HttpResponse<any>) => {
            console.error(error);
            this.addCardButtonOptions.buttonColor = 'warn';
            this.addCardButtonOptions.active = false;
            this.addCardButtonOptions.text = "Retry";
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
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        response => {
          this.removeMultiverseIdFromDataTableIfExists(multiverseId);
        },
        (error: HttpResponse<any>) => {
          console.error(error)
        });
  }

  private removeMultiverseIdFromDataTableIfExists(multiverseId: number): boolean {
    var indexOfExistingCard = this.loadedWatchlistDataSource.data.findIndex(x => x.multiverseId == multiverseId);
    if (indexOfExistingCard >= 0) {
      var tempArray = this.loadedWatchlistDataSource.data;
      tempArray.splice(indexOfExistingCard, 1);
      this.updateTableDataSource(tempArray);
      return true;
    }
    return false;
  }

  private reinitializeComponentValues(): void {
    this.addCardButtonOptions.disabled = true;
    this.addCardButtonOptions.buttonColor = 'black';
    this.addCardButtonOptions.text = 'Add to my watch list!';
    this.newCard = this.emptyCard;
    this.cardOptions = [];
    this.currentlyLoadedCardName = "";
    this.pricePlaceholderValue = "Current Price";
  }

  applyTableFilter(filterValue: string) {
    this.loadedWatchlistDataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTableDataSource(newData: MtgCardListing[]) {
    this.loadedWatchlistDataSource.data = newData;
    this.loadedWatchlistDataSource.paginator = this.paginator;
    this.loadedWatchlistDataSource.sort = this.sort;
  }

  getStyleBasedOnProfit(profit: number) {
    let maxFontWeight: number = 1000;
    let fontWeight = (Math.abs(profit) * 250) > maxFontWeight ? maxFontWeight : (Math.abs(profit) * 250);
    let styles = {
      'color': (profit < 0) ? 'darkred' : 'forestgreen',
      'font-weight': fontWeight
    };
    return styles;
  }
}

