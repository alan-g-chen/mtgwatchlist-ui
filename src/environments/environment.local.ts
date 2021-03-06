// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Facebook info
  facebookAppId: "246535755994969",

  // API info
  watchlistApiGetCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist",
  watchlistApiUpdateCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist/update",
  watchlistApiRemoveCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist/remove",
  //watchlistApiGetCardsUri: "http://localhost:63516/api/watchlist",

  scryfallApiFuzzyFetchUrl: "https://api.scryfall.com/cards/named?fuzzy=",
  scryfallApiSearchUrl: "https://api.scryfall.com/cards/search?q=",
  scryfallApiMultiverseUrl: "https://api.scryfall.com/cards/multiverse/",
  scryfallApiAutocompleteUrl: "https://api.scryfall.com/cards/autocomplete?q="
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
