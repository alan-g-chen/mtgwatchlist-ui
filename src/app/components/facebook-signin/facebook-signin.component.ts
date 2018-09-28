import { Component, OnInit } from '@angular/core';
import { SocialService, FacebookLoginProvider } from "ng6-social-button";
import { TokenManagerService } from "../../services/token-manager/token-manager.service"

@Component({
  selector: 'app-facebook-signin',
  templateUrl: './facebook-signin.component.html',
  styleUrls: ['./facebook-signin.component.css']
})
export class FacebookSigninComponent implements OnInit {

  private userToken: string;

  public userName: string;

  public shareObj = {
    href: "https://mtgwatchlist-ui.azurewebsites.net",
    hashtag:"#MtWatchlist"
  };

  constructor(private socialAuthService: SocialService, private tokenManagerService: TokenManagerService) { }

  ngOnInit() {
    this.userToken = null;
  }
  public signOut() {
    if (this.socialAuthService.isSocialLoggedIn()) {
      this.socialAuthService.signOut().catch((err) => {
        console.error(err);
      });
      this.userToken = null;
      this.tokenManagerService.myAccessToken(this.userToken);
    }
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_TYPE;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (socialUser) => {
        this.userName = socialUser.name;
        this.userToken = socialUser.accessToken;
        this.tokenManagerService.myAccessToken(this.userToken);
      });
  }

  public facebookSharing(shareObj: any) {
    this.socialAuthService.facebookSharing(shareObj);
  }

  public isAuthenticated(): boolean {
    return (null != this.userToken);
  }
}
