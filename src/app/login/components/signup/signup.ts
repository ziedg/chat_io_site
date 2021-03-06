import 'rxjs/add/operator/map';

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { emailValidator } from '../../../utils/validationService';
import { LoginService } from '../../services/loginService';

@Component({
  moduleId: module.id,
    selector: 'sign-up',
    templateUrl: 'signup.html'
})


export class Signup {

    form;
    errorMessage:string = null;
    loadingSign=false;

    /* constructor */
    constructor(public translate: TranslateService, private title:Title,private http: Http, private router: Router, private loginService: LoginService) {
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
            this.errorMessage ="SP_FV_ER_LAST_NAME_SBN_EMPTY";
            return ;
        }
        if(this.form.value.firstName == ""){
            this.errorMessage ="SP_FV_ER_FIRST_NAME_SBN_EMPTY";
            return ;
        }
        if(this.form.value.email == ""){
            this.errorMessage ="SP_FV_ER_EMAIL_SBN_EMPTY";
            return ;
        }
        if(emailValidator(this.form.controls.email)){
            this.errorMessage ="SP_FV_ER_EMAIL_NOT_VALID";
            return ;
        }
        if(this.form.value.password == ""){
            this.errorMessage ="SP_FV_ER_PASSWORD_SBN_EMPTY";
            return ;
        }
        if(this.form.value.password.length<5){
            this.errorMessage ="SP_FV_ER_PASSWORD_SIZE";
            return ;
        }
        this.form.value.email=this.form.value.email.trim().toLowerCase();
        this.loadingSign=true;
        let body = JSON.stringify(this.form.value);
        this.http.post(environment.SERVER_URL + pathUtils.SIGN_UP, body, AppSettings.OPTIONS)
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
                }
                else {
                     this.errorMessage= response.error ;
                }
            },
                err => {
                  this.errorMessage = "SP_ER_TECHNICAL_ERROR";
            },
            () => {
              this.loadingSign=false;
            }
        );
    }
}



