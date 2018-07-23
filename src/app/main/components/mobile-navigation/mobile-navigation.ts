import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

import {User} from '../../../beans/user';
import {LoginService} from '../../../login/services/loginService';

@Component({
    selector: "mobile-navigation",
    templateUrl: "mobile-navigation.html",
    styleUrls: ["mobile-navigation.css"]
})

export class MobileNavigation {
    public user: User = new User();
    constructor(private translate: TranslateService, private loginService: LoginService) {
      this.loginService.redirect();
      this.user = this.loginService.getUser();
    }
}
