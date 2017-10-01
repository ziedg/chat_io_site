import {Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';

/* beans */
import {SocialUser} from '../../beans/social-user';
import {User} from '../../beans/user';
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

declare const FB:any;
declare const auth2:any;

@Component({
  moduleId: module.id,
    selector: 'sign-in',
    templateUrl: 'signin.html'
})


export class Signin {
    form;
    errorMessage:string = null;
    facebookUser : SocialUser;
    googleUser : SocialUser;
    loadingSign=false;
    constructor(private title:Title,public http:Http, private router:Router, private loginService:LoginService) {
        this.title.setTitle("Connexion - Speegar");

        if(loginService.isConnected()){
            this.router.navigate(['/main/home']);
        }
        if(loginService.isWasConnectedWithFacebook()){
            this.router.navigate(['/login/facebook-login']);
        }

        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

    }



    signin() {

        this.errorMessage = null;
        this.form.controls.email._touched = true;
        this.form.controls.password._touched = true;

        if (this.form.value.email == "") {
            this.errorMessage = "Saisissez votre Email.";
            return;
        }

        if (this.form.value.password == "") {
            this.errorMessage = "Saisissez votre mot de passe.";
            return;
        }
        this.loadingSign = true;
        let body = JSON.stringify(this.form.value);
        this.http.post(environment.SERVER_URL + 'signin', body, AppSettings.OPTIONS)
            .map((res:Response) => res.json())
            .subscribe(
                response => {
                    if (response.status == "0") {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                        this.loginService.actualize();
                        this.router.navigate(['/main/home']);
                        this.loadingSign = false;
                    }
                    else {
                        if(response.message=="Authentication failed. User not found."){
                            this.errorMessage = "Le nom d’utilisateur entré n’appartient à aucun compte. Veuillez le vérifer et réessayer.";
                        }
                        else if(response.message=="Authentication failed. Wrong password."){
                            this.errorMessage = "Votre mot de passe est incorrect. Veuillez le vérifer.";
                        }
                        else {
                            this.errorMessage = response.message;
                        }
                        this.loadingSign = false;
                    }
                },
                err => {
                    this.errorMessage = "Erreur technique."
                    this.loadingSign = false;
                },
                () => {
                }
            );
    }

}



