import 'rxjs/add/operator/map';

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LoginService } from '../../services/loginService';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  moduleId: module.id,
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent {
  loadingSign = false;
  errorMessage:string = null;
  form;
  passwordIsUpdated = false;

  constructor(public translate:TranslateService,
              private title:Title, public http:Http, private router:Router,
              private loginService:LoginService, private route:ActivatedRoute,
              private resetPasswordService:ResetPasswordService) {
    this.title.setTitle("Connexion - Speegar");
    this.form = new FormGroup({
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });

    if (loginService.isConnected()) {
      this.router.navigate(['/main/home']);
    }

  }

  resetPassword() {

    this.errorMessage = null;
    this.form.controls.password._touched = true;
    this.form.controls.confirm_password._touched = true;

    if (this.form.value.password == "") {
      this.errorMessage = "SP_FV_ER_PASSWORD_EMPTY";
      return;
    }

    if (this.form.value.confirm_password == "") {
      this.errorMessage = "SP_FV_ER_CONFIRM_PASSWORD_EMPTY";
      return;
    }

    if (this.form.value.confirm_password !== this.form.value.confirm_password) {
      this.errorMessage = "SP_FV_ER_PASSWORDS_NOT_MATCH";
      return;
    }

    if (this.form.value.password.length < 5) {
      this.errorMessage = "SP_FV_ER_PASSWORD_SIZE";
      return;
    }

    this.loadingSign = true;
    this.route.params
      .subscribe((params:Params) =>
        this.resetPasswordService.resetPassword(
          {
            randomString: params['code'],
            newPassword: this.form.value.password
          })
          .then(response => {
            this.loadingSign = false;

            if (response.status == 0) {
              this.passwordIsUpdated = true;
            }
            else {
              this.errorMessage = response.error;
            }
          }));
  }


}
