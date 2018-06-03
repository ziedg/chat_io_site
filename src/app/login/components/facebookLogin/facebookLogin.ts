import 'rxjs/add/operator/map';

import { Component, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { SocialUser } from '../../../beans/social-user';
import { User } from '../../../beans/user';
import { AppSettings } from '../../../shared/conf/app-settings';
import { LoginService } from '../../services/loginService';

declare var jQuery: any;

declare const FB:any;

@Component({
  moduleId: module.id,
    selector: 'facebook-login',
    templateUrl: 'facebookLogin.html'
})

export class FacebookLogin {

    errorMessage:string = null;
    facebookUser : SocialUser;
    loadingSign=false;

    constructor(public translate: TranslateService, private title:Title,public http:Http, private router:Router, private loginService:LoginService,
        private ngZone: NgZone) {
        this.title.setTitle("Connexion - Speegar");
        if(!loginService.isWasConnectedWithFacebook()){
            this.router.navigate(['/login/sign-in']);
        }


        if(loginService.isConnected()){

            this.router.navigate(['/main/home']);
        }

        this.facebookUser = this.loginService.getFacebookUser();


        FB.init({
              appId      : '963422573811438',
              status: true,  // enable cookies to allow the server to access
              cookie: true,
              xfbml      : true,
              version    : 'v2.11'
            });
    }
  getFriendsList = function(){

  };
    getUserFacbookConnexion(result) {
        if (result.authResponse) {
            FB.api('/me?fields=picture.witdh(1000).height(1000){url}', ( responsePic => {
                FB.api('/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location', ( response => {
                  FB.api('/me/friends', ( friends => {

                    console.log(JSON.stringify('Facebook friends: ' + friends));
                    //console.log(friends);
                    /* FB.api('/me/friends', ( friends => {
                                        console.log('friends');
                                        console.log(JSON.parse(JSON.stringify('friendsielnidsst:'+friends))) ;
                                        console.log(friends);*/

                    this.getUserInformations(response, responsePic);
                  }));
                }));
            }));
            this.loadingSign=false;
        }
        else {

            this.loadingSign=false;
        }
    }



    getUserInformations(response, responsePic) {
        let body={};

        body = JSON.stringify({
            profilePicture : !!response.picture?responsePic.picture.data.url:'url',
            firstName: response.first_name,
            lastName: response.last_name,
            email: response.email,
            facebookId: response.id,
            birthday: response.birthday,
            gender: response.gender,
            coverPicture: response.cover.source,
        });

        this.http.post(environment.SERVER_URL + 'signWithFacebook', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
                response => {
                if (response.status == "0") {
                    let user : User = response.user ;

                    this.loginService.updateUser(user);
                    localStorage.setItem('user', JSON.stringify(response.user));

                    this.loginService.setToken(response.token);
                    this.loginService.actualize();
                    this.ngZone.run(()=>{
                        this.router.navigate(['/main/home']);
                    });

                }
                else {
                    this.errorMessage = response.message;
                }
            },
                err => {
                console.error(err);
                this.errorMessage = "Erreur technique."
            },
            () => {
                console.log('done');
            }
        );
    }
    goSignIn(){
        this.loginService.deleteUserFacebook();
        this.router.navigate(['/login/sign-in']);
    }

    loginWithFacebook() {
        this.loadingSign=true;
        FB.login(result => {
            this.getUserFacbookConnexion(result);
        }, {scope: 'email,user_photos,user_videos,public_profile,user_birthday,user_location'});

    }


}



