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
  MatExpansionModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { FacebookSigninComponent } from './components/facebook-signin/facebook-signin.component';

import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angular5-social-login";
import { Ng6SocialButtonModule, SocialServiceConfig } from "ng6-social-button";

import { environment } from "../environments/environment";
import { MtgWatchlistComponent } from './components/mtg-watchlist/mtg-watchlist.component'

export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
      .addFacebook(environment.facebookAppId);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    FacebookSigninComponent,
    MtgWatchlistComponent
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
    FormsModule,
    SocialLoginModule,
    Ng6SocialButtonModule
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
    MatExpansionModule
  ],
  providers: [
    {
      provide: SocialServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
