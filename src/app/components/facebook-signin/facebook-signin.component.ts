import { Component, OnInit } from '@angular/core';
import { SocialService } from "ng6-social-button";
import { MatButton } from "@angular/material"
import { TokenManagerService } from "../../services/token-manager/token-manager.service"

@Component({
  selector: 'app-facebook-signin',
  templateUrl: './facebook-signin.component.html',
  styleUrls: ['./facebook-signin.component.css']
})
export class FacebookSigninComponent implements OnInit {

  private userToken: string;

  public userName: string;

  constructor(private socialAuthService: SocialService, private  tokenManagerService : TokenManagerService) { }

  ngOnInit() {
    this.userToken = null;
  }

  public signOut() {
    if (this.socialAuthService.isSocialLoggedIn()) {
      this.socialAuthService.signOut().catch((err) => {
        console.log(err);
      });
      this.userToken = null;
      this.tokenManagerService.myAccessToken(this.userToken);
    }
  }

  public getSocialUser(socialUser) {
    this.userName = socialUser.name;
    this.userToken = socialUser.accessToken;
    this.tokenManagerService.myAccessToken(this.userToken);
    console.log(socialUser);
  }

  public isAuthenticated(): boolean {
    return (null != this.userToken);
  }
}
