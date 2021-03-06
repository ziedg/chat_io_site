import 'rxjs/add/operator/map';

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { SocialUser } from '../../../beans/social-user';
import { AppSettings } from '../../../shared/conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { LoginService } from '../../services/loginService';

@Component({
  selector: "sign-in",
  templateUrl: "signin.html"
})
export class Signin {
  form;
  errorMessage: string = null;
  facebookUser: SocialUser;
  googleUser: SocialUser;
  loadingSign = false;

  constructor(
    public translate: TranslateService,
    private title: Title,
    public http: Http,
    private router: Router,
    private loginService: LoginService
  ) {
    this.title.setTitle("Connexion - Speegar");
    if (loginService.isConnected()) {
      this.router.navigate(["/main/home"]);
    }
    if (loginService.isWasConnectedWithFacebook()) {
      this.router.navigate(["/login/facebook-login"]);
    }
    this.form = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  signin() {
    this.errorMessage = null;
    this.form.controls.email._touched = true;
    this.form.controls.password._touched = true;
    if (this.form.value.email == "") {
      this.errorMessage = "SP_FV_ER_EMAIL_EMPTY";
      return;
    }

    if (this.form.value.password == "") {
      this.errorMessage = "SP_FV_ER_PASSWORD_EMPTY";
      return;
    }
    this.form.value.email=this.form.value.email.trim().toLowerCase();
    this.loadingSign = true;
    let body = JSON.stringify(this.form.value);
    this.http
      .post(
        environment.SERVER_URL + pathUtils.SIGN_IN,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {

          if (response.status == "0") {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            this.loginService.actualize();
            this.router.navigate(["/main/home"]);
          } else {
            this.errorMessage = response.error;
          }
        },
        err => {
          this.errorMessage = "SP_ER_TECHNICAL_ERROR";
        },
        () => {
          this.loadingSign = false;
        }
      );
  }
}
