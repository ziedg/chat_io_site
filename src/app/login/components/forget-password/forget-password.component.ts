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
import { LoginService } from '../../services/loginService';

@Component({
  moduleId: module.id,
  templateUrl: 'forget-password.component.html'
})
export class ForgetPasswordComponent {
  loadingSign = false;
  errorMessage:string = null;
  form;
  mailIsSent = false;

  constructor(public translate:TranslateService, private title:Title, public http:Http, private router:Router, private loginService:LoginService) {
    this.title.setTitle("Connexion - Speegar");
    this.form = new FormGroup({
      email: new FormControl('', Validators.required)
    });

    if (loginService.isConnected()) {
      this.router.navigate(['/main/home']);
    }

  }

  forgetPassword() {

    this.errorMessage = null;
    this.form.controls.email._touched = true;

    if (this.form.value.email == "") {
      this.errorMessage = "SP_FV_ER_EMAIL_EMPTY";
      return;
    }

    this.loadingSign = true;
    //this.form.value.email.toLowerCase()
    let body = JSON.stringify(this.form.value);
    this.http.post(environment.SERVER_URL + pathUtils.FORGET_PASSWORD,
      body, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(response => {
        if (response.status == "0") {
          this.mailIsSent = true
        }
        else {
          this.errorMessage = response.error;
        }
      },
        err => {
        this.errorMessage = "SP_ER_TECHNICAL_ERROR"
      },
      () => {
        this.loadingSign = false;
      }
    );
  }

  resetForgetPassword() {
    this.mailIsSent = false;
    this.errorMessage = null;
    this.form.value.email = "";
    this.loadingSign = false;
  }

}
