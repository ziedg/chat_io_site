/**
 * Created by chaker on 27/11/16.
 */


import {Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/map';

/* conf */
import {AppSettings} from '../../conf/app-settings';

/* services */
import {LoginService} from '../../service/loginService';

import {Title} from "@angular/platform-browser";
import {ResetPasswordService} from "./reset-password.service";

@Component({
  moduleId: module.id,
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent {
  loadingSign = false;
  errorMessage: string = null;
  form;

  constructor(private title: Title, public http: Http, private router: Router,
              private loginService: LoginService, private route: ActivatedRoute,
              private resetPasswordService: ResetPasswordService) {
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
      this.errorMessage = "Saisissez votre Mot de passe.";
      return;
    }

    if (this.form.value.confirm_password == "") {
      this.errorMessage = "Confirmez votre Mot de passe.";
      return;
    }

    if (this.form.value.confirm_password !== this.form.value.confirm_password) {
      this.errorMessage = "Les deux mots de passe ne se correspondent pas.";
      return;
    }

    this.loadingSign = true;
    this.route.params
    // (+) converts string 'id' to a number  +params['id']
      .subscribe((params: Params) =>
        this.resetPasswordService.resetPassword(
          {
            randomString: params['code'],
            newPassword: this.form.value.password
          })
          .then(response => {
            if (response.status == 1) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              this.loginService.actualize();
              this.router.navigate(['/main/home']);
              this.loadingSign = false;
            }
            else {
              if (response.message == "Authentication failed. User not found.") {
                this.errorMessage = "Le nom d’utilisateur entré n’appartient à aucun compte. Veuillez le vérifer et réessayer.";
              }
              else if (response.message == "Authentication failed. Wrong password.") {
                this.errorMessage = "Votre mot de passe est incorrect. Veuillez le vérifer.";
              }
              else {
                this.errorMessage = response.message;
              }
              this.loadingSign = false;
            }
          }));


  }

  RedirectTo(link: string) {
    AppSettings.Redirect(link);
  }


}
