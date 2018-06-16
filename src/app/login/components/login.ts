import 'rxjs/add/operator/map';

import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../environments/environment';
import { SocialUser } from '../../beans/social-user';
import { User } from '../../beans/user';
import { AppSettings } from '../../shared/conf/app-settings';
import { LoginService } from '../services/loginService';

declare var FB: any;
declare var window: any;
declare const auth2: any;
declare const attachSignin: any;
declare const emptyFunction: any;

@Component({
  moduleId: module.id,
  selector: "login",
  templateUrl: "login.html"
})
export class Login {
  form;
  errorMessage: string = null;
  facebookUser: SocialUser;

  loadingSign = false;
  dontShowSocialNetworksLoginButtons = false;
  loadingFb = false;
  public loacationPath: string = "/login/sign-in";

  constructor(
    public translate: TranslateService,
    private _loc: Location,
    private title: Title,
    public http: Http,
    private router: Router,
    private loginService: LoginService,
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.title.setTitle("Connexion - Speegar");

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = () => {
      FB.init({
        appId: "2085900211669240",
        status: true, // enable cookies to allow the server to access
        cookie: true,
        xfbml: true,
        oauth: true,
        version: "v2.11"
      });
    };

    this.form = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    if (this.loginService.isConnected()) {
      this.router.navigate(["/main/home"]);
    }
    this.router.events.subscribe(route => {
      this.changeLocationPath();
      this.changeDetector.markForCheck();
    });

    FB.init({
      appId: "2085900211669240",
      status: true, // enable cookies to allow the server to access
      cookie: true,
      xfbml: true,
      version: "v2.12"
    });
  }

  changeLocationPath() {
    this.loacationPath = this._loc.path();
    if (
      this.loacationPath == "/login/reset-password" ||
      this.loacationPath == "/login/facebook-login" ||
      this.loacationPath == "/login/google-login"
    ) {
      this.dontShowSocialNetworksLoginButtons = true;
    } else {
      this.dontShowSocialNetworksLoginButtons = false;
    }
  }

  ngOnInit() {}

  getUserFacbookConnexion(result) {
    if (result.authResponse) {
      FB.api(
        "/me?fields=picture.witdh(70).height(70){url}",
        responseSmallPic => {

          FB.api(
            "/me/?fields=picture.width(1000).height(1000){url}",
            responsePic => {
              FB.api(
                "/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location",
                response => {
                  FB.api('me/?fields=friends', ( friends => {
                    console.log('friends');
                    console.log(JSON.stringify('Facebook friends: ' + friends));
                    console.log(friends);


                    this.getUserInformations(
                      response,
                      responsePic,
                      responseSmallPic,
                      friends
                    );
                  }));

                  this.loadingFb = false;
                }
              );
            }
          );
        }
      );
    } else {
      this.loadingFb = false;
    }
  }

  getUserInformations(response, responsePic, responseSmallPic,friends) {
    let body = {};
    body = JSON.stringify({
      profilePicture: responsePic.picture.data.url,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
      facebookId: response.id,
      birthday: response.birthday,
      gender: response.gender,
      friends: friends.friends.data,
  
      //coverPicture: response.cover.source,
      profilePictureMin: responseSmallPic.picture.data.url,
       

    }
  );
  console.log(response.data);
  
    this.changeDetector.markForCheck();

    this.http
      .post(
        environment.SERVER_URL + "signWithFacebook",
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == "0") {
            let user: User = response.user;


            this.loginService.updateUser(user);
            this.loginService.setToken(response.token);
            if (response.user.isNewInscri == "true") {
              localStorage.setItem("isNewInscri", "true");
            }
            this.facebookUser = new SocialUser();
            this.facebookUser.firstName = user.firstName;
            this.facebookUser.lastName = user.lastName;
            this.facebookUser.profilePicture = user.profilePicture;

            localStorage.setItem(
              "facebookUser",
              JSON.stringify(this.facebookUser)
            );

            this.zone.run(() => this.router.navigate(["/main/home"]));
          } else {
            this.errorMessage = response.message;
          }
        },
        err => {
          this.errorMessage = "Erreur technique.";
        },
        () => {}
      );
  }

  loginWithFacebook() {
    this.loadingFb = true;
    FB.login(
      result => {


        this.getUserFacbookConnexion(result);
      },
      {scope: 'email,user_photos,user_videos,public_profile,user_birthday,user_location,user_friends'}
      //consolegi
    );
  }

  bindedVariable = "";

  onEnterFunction($event: any) {}

  public openPopup: Function;

  setPopupAction(fn: any) {
    this.openPopup = fn;
  }
  useLanguage(language: string) {
    localStorage.setItem('userLang',language);
    this.translate.setDefaultLang(language);
     console.log(localStorage.getItem('userLang')) ;
  }
}
