// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  facebookAppId: "246535755994969",
  watchlistApiGetCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist",
  watchlistApiUpdateCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist/update",
  watchlistApiRemoveCardsUri: "https://mtgwatchlist-api.azurewebsites.net/api/watchlist/remove",
  scryfallApiFuzzyFetchUrl: "https://api.scryfall.com/cards/named?fuzzy=",
  scryfallApiSearchUrl: "https://api.scryfall.com/cards/search?q=",
  scryfallApiMultiverseUrl: "https://api.scryfall.com/cards/multiverse/",
  scryfallApiAutocompleteUrl: "https://api.scryfall.com/cards/autocomplete?q="
};