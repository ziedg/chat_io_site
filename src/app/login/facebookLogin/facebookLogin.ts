import {Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';
declare var jQuery: any;

/* beans */
import {User} from '../../beans/user';
import {Title} from "@angular/platform-browser";
import {SocialUser} from "../../beans/social-user";
import {environment} from "../../../environments/environment";


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

    constructor(public translate: TranslateService, private title:Title,public http:Http, private router:Router, private loginService:LoginService) {
        this.title.setTitle("Connexion - Speegar");
        if(!loginService.isWasConnectedWithFacebook()){
            this.router.navigate(['/login/sign-in']);
        }
        console.log("facebookLoginConstrctor")



            this.router.navigate(['/main/home']);
        
        this.facebookUser = this.loginService.getFacebookUser();


        FB.init({
              appId      : '963422573811438',
              status: true,  // enable cookies to allow the server to access
              cookie: true,
              xfbml      : true,
              version    : 'v2.11'
            });
    }

    getUserFacbookConnexion(result) {
        if (result.authResponse) {
            FB.api('/me?fields=picture.witdh(1000).height(1000){url}', ( responsePic => {
                FB.api('/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location', ( response => {
                    this.getUserInformations(response, responsePic);
                }));
            }));
            this.loadingSign=false;
        }
        else {
            console.log('User cancelled login or did not fully authorize.');
            this.loadingSign=false;
        }
    }



    getUserInformations(response, responsePic) {
        let body={};
        console.log(response)
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
                    console.log("from facebook component")
                    console.log(response)
                    this.loginService.setToken(response.token);
                    this.loginService.actualize();
                    this.router.navigate(['/main/home']);

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



