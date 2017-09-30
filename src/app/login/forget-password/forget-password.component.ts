/**
 * Created by chaker on 20/11/16.
 */


import {Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';

import {Title} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  templateUrl: 'forget-password.component.html'
})
export class ForgetPasswordComponent {
  loadingSign = false;
  errorMessage:string = null;
  form;

  constructor(private title: Title, public http: Http, private router: Router, private loginService: LoginService) {
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
      this.errorMessage = "Saisissez votre Email.";
      return;
    }

    this.loadingSign = true;
    let body = JSON.stringify(this.form.value);
    this.http.post(AppSettings.SERVER_URL + 'resetPwdMail', body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe( response => this.router.navigate(['/login/sigin']));
  }

  RedirectTo(link: string) {
    AppSettings.Redirect(link);
  }

}
