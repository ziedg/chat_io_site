import {Location} from '@angular/common';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate';

/* Login components */
import {Signin} from './signin/signin';
import {Signup} from './signup/signup';
import {FacebookLogin} from './facebookLogin/facebookLogin';


import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
/* conf */
import {AppSettings} from '../conf/app-settings';

/* services */
import {LoginService} from '../service/loginService';

/* beans */
import {SocialUser} from '../beans/social-user';
import {User} from '../beans/user';
import {Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";

declare var FB: any;
declare var window:any
declare const auth2: any;
declare const attachSignin: any;
declare const emptyFunction: any;

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.html'
})

export class Login {

  form;
  errorMessage: string = null;
  facebookUser: SocialUser;

  loadingSign = false;
  dontShowSocialNetworksLoginButtons = false;
  loadingFb = false;
  public loacationPath: string = "/login/sign-in";

  constructor(public translate: TranslateService,private _loc: Location, private title: Title, public http: Http, private router: Router, private loginService: LoginService, private changeDetector: ChangeDetectorRef) {
    this.title.setTitle("Connexion - Speegar");

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


  window.fbAsyncInit = () => {
      console.log("fbasyncinit")

      FB.init({
        appId      : '963422573811438',
        status: true,  // enable cookies to allow the server to access
        cookie: true,
        xfbml      : true,
        oauth:true,
        version    : 'v2.11'
      });
     };


    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    if (this.loginService.isConnected()) {
      this.router.navigate(['/main/home']);
    }
    this.router.events.subscribe(route => {
      this.changeLocationPath();
      this.changeDetector.markForCheck();
    });





    FB.init({
          appId      : '963422573811438',
          status: true,  // enable cookies to allow the server to access
          cookie: true,
          xfbml      : true,
          version    : 'v2.12'
        });


  }

  changeLocationPath() {
    this.loacationPath = this._loc.path();
    if (this.loacationPath == "/login/reset-password" || this.loacationPath == "/login/facebook-login" || this.loacationPath == "/login/google-login") {
      this.dontShowSocialNetworksLoginButtons = true;
    }
    else {
      this.dontShowSocialNetworksLoginButtons = false;
    }
  }

  ngOnInit() {
  }

  getUserFacbookConnexion(result) {

    if (result.authResponse) {
      FB.api('/me?fields=picture.witdh(70).height(70){url}', (
        responseSmallPic => {
          console.log(`ResponsePIC ${responseSmallPic}`)
        FB.api('/me/?fields=picture.width(1000).height(1000){url}', ( responsePic => {
          FB.api('/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location', ( response => {
            this.getUserInformations(response, responsePic, responseSmallPic);
            this.loadingFb = false;
          }));
        }));
      }));
    }
    else {
      this.loadingFb = false;
    }
  }

  getUserInformations(response, responsePic, responseSmallPic) {
    let body = {};
    console.log(JSON.stringify(response))
    body = JSON.stringify({
      profilePicture:responsePic.picture.data.url,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
      facebookId: response.id,
      birthday: response.birthday,
      gender: response.gender,
      //coverPicture: response.cover.source,
      profilePictureMin: responseSmallPic.picture.data.url
    });

    this.http.post(environment.SERVER_URL + 'signWithFacebook', body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

          if (response.status == "0") {
            let user: User = response.user;

            console.log(JSON.stringify(user));
            this.loginService.updateUser(user);
            this.loginService.setToken(response.token);
            if (response.user.isNewInscri == "true") {
              localStorage.setItem('isNewInscri', "true");
            }
            this.facebookUser = new SocialUser();
            this.facebookUser.firstName = user.firstName;
            this.facebookUser.lastName = user.lastName;
            this.facebookUser.profilePicture = user.profilePicture;

            localStorage.setItem('facebookUser', JSON.stringify(this.facebookUser));
            
            this.changeDetector.markForCheck();


            this.router.navigate(['/main/home']);
          }
          else {
            this.errorMessage = response.message;
          }
        },
        err => {
          this.errorMessage = "Erreur technique.";
        },
        () => {
        }
      );
  }

  loginWithFacebook() {
    this.loadingFb = true;
    FB.login(result => {
      if(result)
      console.log(result)
      else
      console.log("err")

      this.getUserFacbookConnexion(result);
    },{scope:'email'});//{scope: 'email,user_photos,user_videos,public_profile,user_birthday,user_location'});
  }


  bindedVariable = "";

  onEnterFunction($event: any) {

  }

  public openPopup: Function;

  setPopupAction(fn: any) {
    this.openPopup = fn;
  }


}




