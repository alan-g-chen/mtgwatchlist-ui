
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
  MatDialogModule
} from '@angular/material';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { AppComponent } from './app.component';
import { FacebookSigninComponent } from './components/facebook-signin/facebook-signin.component';

import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angular5-social-login";
import { Ng6SocialButtonModule, SocialServiceConfig } from "ng6-social-button";

import { environment } from "../environments/environment";
import { MtgWatchlistComponent } from './components/mtg-watchlist/mtg-watchlist.component'

import { WatchlistApiHttpClientService } from './services/watchlist-api-http-client/watchlist-api-http-client.service';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component'

import { MatProgressButtons } from 'mat-progress-buttons';

export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
    .addFacebook(environment.facebookAppId);
  return config;
}

@NgModule({
  entryComponents: [
    ErrorDialogComponent
  ],
  declarations: [
    AppComponent,
    FacebookSigninComponent,
    MtgWatchlistComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
    MatProgressSpinnerModule,
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
    WatchlistApiHttpClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
