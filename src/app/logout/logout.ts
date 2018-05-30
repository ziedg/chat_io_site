import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import {LoginService} from "../login/services/loginService";
import {Component} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'logout',
  template : ''
})
export class Logout {

    constructor(public http: Http, private router: Router, private loginService: LoginService) {
        this.loginService.logout();
    }
}



