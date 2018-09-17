
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatFormFieldModule,
  MatDividerModule,
  MatInputModule,
  MatExpansionModule,
  MatTableModule,
  MatDialogModule,
  MatSelectModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSidenavModule
} from '@angular/material';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { AppComponent } from './app.component';
import { FacebookSigninComponent } from './components/facebook-signin/facebook-signin.component';

import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angular-6-social-login";
import { Ng6SocialButtonModule, SocialServiceConfig } from "ng6-social-button";

import { environment } from "../environments/environment";
import { MtgWatchlistComponent } from './components/mtg-watchlist/mtg-watchlist.component'

import { WatchlistApiHttpClientService } from './services/watchlist-api-http-client/watchlist-api-http-client.service';
import { ScryfallApiHttpClientService } from './services/scryfall-api-http-client/scryfall-api-http-client.service'

import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component'

import { MatProgressButtons } from 'mat-progress-buttons';
import { GathererDialogComponent } from './components/gatherer-dialog/gatherer-dialog.component';

export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
    .addFacebook(environment.facebookAppId);
  return config;
}

@NgModule({
  entryComponents: [
    ErrorDialogComponent,
    GathererDialogComponent
  ],
  declarations: [
    AppComponent,
    FacebookSigninComponent,
    MtgWatchlistComponent,
    ErrorDialogComponent,
    GathererDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSidenavModule,
    FormsModule,
    SocialLoginModule,
    Ng6SocialButtonModule,
    HttpClientModule,
    HttpModule,
    MatProgressButtons
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatExpansionModule,
    MatTableModule
  ],
  providers: [
    {
      provide: SocialServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    WatchlistApiHttpClientService,
    ScryfallApiHttpClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
