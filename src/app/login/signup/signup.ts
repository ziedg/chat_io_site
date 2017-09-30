import {Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';
import{emailValidator} from '../../utils/validationService'

/* beans */
import {User} from '../../beans/user';
import {Title} from "@angular/platform-browser";
import {SocialUser} from "../../beans/social-user";

declare const FB:any;
declare const gapi:any;
declare const auth2:any;
declare const attachSignin:any;
declare const emptyFunction:any;

@Component({
  moduleId: module.id,
    selector: 'sign-up',
    templateUrl: 'signup.html'
})


export class Signup {

    form;
    errorMessage:string = null;
    facebookUser : SocialUser;
    googleUser : SocialUser;
    loadingSign=false;

    /* constructor */
    constructor(private title:Title,private http: Http, private router: Router, private loginService: LoginService) {
        this.title.setTitle("Inscription - Speegar");
        if(this.loginService.isConnected()){
            this.router.navigate(['/main/home']);
        }

        this.form = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('',Validators.compose([Validators.required, emailValidator ]) ),
            password: new FormControl('', Validators.required)
        });
    }

    /* signup */
    signup() {
        this.errorMessage= null;
        this.form.controls.firstName._touched = true;
        this.form.controls.lastName._touched = true;
        this.form.controls.email._touched = true;
        this.form.controls.password._touched = true;
        if(this.form.value.lastName == ""){
            this.errorMessage ="Le nom est obligatoire.";
            return ;
        }
        if(this.form.value.firstName == ""){
            this.errorMessage ="Le prenom est obligatoire.";
            return ;
        }
        if(this.form.value.email == ""){
            this.errorMessage ="L'email est obligatoire.";
            return ;
        }
        if(emailValidator(this.form.controls.email)){
            this.errorMessage ="L'email saisi est invalide.";
            return ;
        }
        if(this.form.value.password == ""){
            this.errorMessage ="Le mot de passe est obligatoire.";
            return ;
        }
        if(this.form.value.password.length<5){
            this.errorMessage ="Créez un mot de passe d’au moins 5 caractères.";
            return ;
        }
        this.loadingSign=true;
        let body = JSON.stringify(this.form.value);
        this.http.post(AppSettings.SERVER_URL + 'signup', body, AppSettings.OPTIONS)
            .map((res: Response) => res.json())
            .subscribe(
                response => {
                if (response.status == "0") {

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    if(response.user.isNewInscri == "true"){
                        localStorage.setItem('isNewInscri', "true");
                    }
                    this.loginService.actualize();
                    this.router.navigate(['/main/home']);
                    this.loadingSign=false;
                }
                else {
                    if(response.message=="Email existe deja"){
                            this.errorMessage = "Un autre compte utilise "+this.form.value.email;
                    }else {
                            this.errorMessage= response.message ;
                    }
                    this.loadingSign=false;
                }
            },
                err => {
                console.error(err);
                this.errorMessage="Erreur technique."
                this.loadingSign=false;
            },
            () => {
            }
        );
    }



}



